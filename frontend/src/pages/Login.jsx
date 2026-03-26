import { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
            window.location.reload(); // State refresh ke liye
        } catch (err) {
            alert(err.response?.data?.msg || "Login Failed");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Smart Tracker Login</h2>
                <input 
                    type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded focus:outline-blue-400"
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
                <input 
                    type="password" placeholder="Password" className="w-full p-2 mb-6 border rounded focus:outline-blue-400"
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">Login</button>
                <p className="mt-4 text-center text-sm">
                    Naye ho? <Link title="Register" to="/register" className="text-blue-500 underline">Register yahan karo</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;