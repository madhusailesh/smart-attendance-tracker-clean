// backend/controllers/aiController.js
const Tesseract = require('tesseract.js');
const { Groq } = require('groq-sdk');
const fs = require('fs'); // Temporary file delete karne ke liye

// Groq Initialize (Ensure API key is there)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.processTimeTable = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

        const imagePath = req.file.path;

        // 1.OCR with Tesseract (Try adding preprocessing)
        const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
            // Optional: You can try adding PSM (Page Segmentation Mode) if needed
            // logger: m => console.log(m) // for debugging OCR progress
        });
        
        // OCR text ko log karke check karo agar readable hai
        // console.log("OCR Extracted Text:", text); 

        if (!text || text.trim().length < 50) {
            fs.unlinkSync(imagePath); // Delete the uploaded file
            return res.status(422).json({ msg: "Image clear nahi thi, text padh nahi paya." });
        }

        // 2. Updated Smart Prompt for Groq (The Key Part)
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert at parsing messy OCR text from academic timetables into structured JSON. 

                    Rules for parsing:
                    - The OCR text comes from a grid table (Days on rows, Time slots on columns).
                    - Class slots often contain Subject Names, Instructor Codes, and Room Numbers (like C-303).
                    - Labs often span multiple slots and have names like '---CHEM Lab---'.
                    - If a subject slot contains multiple lines like 'CHEM (LS)' and 'C-303', the Subject is 'CHEM'.
                    - If a day name (MON, TUE, etc.) is missing, infer the sequence.
                    - If a time slot has no content, ignore it.

                    Output format MUST be JSON like this:
                    {
                      "schedule": [
                        { "day": "Monday", "classes": [ { "subject": "CHEM", "startTime": "9:00 AM", "endTime": "10:00 AM" } ] }
                      ]
                    }`
                },
                {
                    role: "user",
                    content: `Please convert this messy OCR text into a structured JSON schedule: ${text}`
                }
            ],
            model: "llama-3.1-70b-versatile",
            response_format: { type: "json_object" }
        });

        // Parse AI response
        const parsedResponse = JSON.parse(chatCompletion.choices[0].message.content);
        
        // Clean up: Delete temporary file
        fs.unlinkSync(imagePath);

        // Optional: Pre-process response to ensure correct format before sending to DB
        if (!parsedResponse.schedule) {
             return res.status(422).json({ msg: "AI organized the schedule, but format was wrong." });
        }

        res.json(parsedResponse.schedule); // We only need the schedule array

    } catch (err) {
        console.error(err);
        // Clean up even on error
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ msg: "AI Parsing Failed" });
    }
};