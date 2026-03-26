import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', formData);
            alert("Registration Successful! Now Login.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.msg || "Error occurred");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Join Tracker</h2>
                <input 
                    type="text" placeholder="Name" className="w-full p-2 mb-4 border rounded"
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
                <input 
                    type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded"
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
                <input 
                    type="password" placeholder="Password" className="w-full p-2 mb-6 border rounded"
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Register</button>
            </form>
        </div>
    );
};

export default Register;