import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const UploadSchedule = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Photo toh select kar!");

        const formData = new FormData();
        formData.append('timetable', file);

        setLoading(true);
        try {
            // Backend ko File bhejo
            const res = await API.post('/ai/process-timetable', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // AI se parsed data milne ke baad dashboard pe bhej do
            console.log("AI Parsed Data:", res.data);
            alert("AI ne timetable samajh liya hai! 🎯");
            navigate('/dashboard');
        } catch (err) {
            alert("Error: Image clear nahi thi ya AI ko samajh nahi aya.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-10 bg-white min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Upload Timetable Image</h2>
            <form onSubmit={handleUpload} className="border-4 border-dashed border-blue-200 p-10 rounded-3xl text-center">
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setFile(e.target.files[0])} 
                    className="mb-6"
                />
                <button 
                    className={`w-full p-3 rounded-xl text-white font-bold ${loading ? 'bg-gray-400' : 'bg-blue-600'}`}
                    disabled={loading}
                >
                    {loading ? "AI Reading Image..." : "Upload & Analyze"}
                </button>
            </form>
        </div>
    );
};

export default UploadSchedule;