import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Setup = () => {
    const [dates, setDates] = useState({ semesterStart: '', semesterEnd: '', threshold: 75 });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put('/user/update', dates);
            alert("Semester Dates Saved!");
            navigate('/dashboard');
        } catch (err) {
            alert("Error saving dates");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-2xl w-96 border-b-8 border-blue-600">
                <h2 className="text-2xl font-bold mb-6 text-blue-800">📅 Semester Setup</h2>
                
                <label className="block mb-2 text-sm font-medium">Semester Kab Start Hua?</label>
                <input 
                    type="date" className="w-full p-2 mb-4 border rounded-lg"
                    onChange={(e) => setDates({...dates, semesterStart: e.target.value})} 
                />

                <label className="block mb-2 text-sm font-medium">Semester Kab Khatam Hoga?</label>
                <input 
                    type="date" className="w-full p-2 mb-4 border rounded-lg"
                    onChange={(e) => setDates({...dates, semesterEnd: e.target.value})} 
                />

                <label className="block mb-2 text-sm font-medium">Min Attendance % (Target)</label>
                <input 
                    type="number" placeholder="75" className="w-full p-2 mb-6 border rounded-lg"
                    onChange={(e) => setDates({...dates, threshold: e.target.value})} 
                />

                <button className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition">
                    Save & Continue
                </button>
            </form>
        </div>
    );
};

export default Setup;