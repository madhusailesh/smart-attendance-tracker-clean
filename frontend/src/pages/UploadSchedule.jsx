import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const UploadSchedule = () => {
    const [rawText, setRawText] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleParse = async () => {
        setLoading(true);
        try {
            // 1. Send text to Groq AI
            const res = await API.post('/ai/process-timetable', { rawText });
            const parsedData = res.data; // AI se JSON mil gaya

            // 2. Save this parsed schedule to our MongoDB
            // Hum ek loop chalayenge har day ke liye
            for (const daySchedule of parsedData.schedule) {
                await API.post('/ai/save-schedule', daySchedule);
            }

            alert("AI has successfully organized your schedule! 🚀");
            navigate('/dashboard');
        } catch (err) {
            alert("AI was confused. Please try again with clearer text.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-blue-700">Upload Time-Table</h2>
            <p className="text-gray-600 mb-6">Paste your class timings here. My AI will handle the rest.</p>
            
            <textarea 
                className="w-full h-64 p-4 border-2 border-dashed border-blue-300 rounded-xl focus:border-blue-500 outline-none"
                placeholder="Example: Monday - 10am Math, 11am Physics. Tuesday - 2pm Lab..."
                onChange={(e) => setRawText(e.target.value)}
            ></textarea>

            <button 
                onClick={handleParse}
                disabled={loading || !rawText}
                className={`mt-6 w-full p-4 rounded-xl font-bold text-white transition ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {loading ? "AI is Thinking... 🧠" : "Analyze with AI"}
            </button>
        </div>
    );
};

export default UploadSchedule;