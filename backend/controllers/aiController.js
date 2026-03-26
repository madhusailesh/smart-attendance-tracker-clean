const { Groq } = require("groq-sdk");
const Schedule = require("../models/Schedule");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.processTimeTable = async (req, res) => {
  try {
    // Filhaal hum image se text manually ya simple OCR se bhejenge
    // Kyuki Groq mostly text-based hai, hum Tesseract ya direct text prompt use karenge
    const { rawText } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a timetable parser. Convert the raw text into a clean JSON array of objects with keys: day, classes (which is an array of {subject, startTime, endTime}).",
        },
        {
          role: "user",
          content: `Analyze this timetable text and give me ONLY the JSON: ${rawText}`,
        },
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
    });

    const parsedSchedule = JSON.parse(
      chatCompletion.choices[0].message.content,
    );

    // Response check karne ke liye
    res.json(parsedSchedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "AI Processing Failed" });
  }
};
