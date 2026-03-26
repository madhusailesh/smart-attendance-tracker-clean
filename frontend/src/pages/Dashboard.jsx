import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, XCircle, PlusCircle, Calendar } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [todayClasses, setTodayClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchData = async () => {
        try {
            // 1. Fetch Attendance Stats
            const resStats = await API.get('/attendance/stats');
            setStats(resStats.data);

            // 2. Get Today's Day Name
            const today = new Date().toLocaleString('en-us', { weekday: 'long' });
            
            // 3. Fetch Schedule for Today (Backend API for specific day)
            // Note: Make sure your backend has a route to get schedule by day
            const resSchedule = await API.get(`/ai/schedule/${today}`);
            setTodayClasses(resSchedule.data?.classes || []);
            
        } catch (err) {
            console.log("Setup not complete or No classes today");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const markAbsent = async (subject) => {
        try {
            const todayDate = new Date().toISOString().split('T')[0];
            await API.post('/attendance/mark', {
                date: todayDate,
                subject: subject,
                status: 'Absent'
            });
            alert(`${subject} marked as Absent`);
            fetchData(); // Refresh stats
        } catch (err) {
            alert("Error marking attendance");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading Tracker...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            {/* Header */}
            <div className="max-w-5xl mx-auto flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Hi, {user?.name}!</h1>
                    <p className="text-gray-500">VSSUT EEE - Semester Tracker</p>
                </div>
                <button onClick={handleLogout} className="bg-white border border-red-200 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition">
                    Logout
                </button>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Main Stats Card */}
                <div className={`col-span-1 md:col-span-2 p-8 rounded-3xl shadow-lg text-white flex flex-col justify-between ${stats?.lowAttendance ? 'bg-gradient-to-br from-red-500 to-orange-600' : 'bg-gradient-to-br from-blue-600 to-indigo-700'}`}>
                    <div>
                        <h2 className="text-xl font-medium opacity-90">Overall Attendance</h2>
                        <div className="flex items-baseline mt-2">
                            <span className="text-7xl font-bold">{stats?.attendancePercentage || 0}</span>
                            <span className="text-2xl ml-1">%</span>
                        </div>
                    </div>
                    
                    {stats?.lowAttendance && (
                        <div className="mt-6 flex items-center bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <AlertTriangle className="mr-2" />
                            <p className="font-semibold text-sm">Warning: Below {stats?.threshold || 75}% threshold!</p>
                        </div>
                    )}
                    
                    <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/20 pt-6">
                        <div>
                            <p className="opacity-70 text-xs uppercase tracking-wider font-bold">Total Classes</p>
                            <p className="text-2xl font-bold">{stats?.totalClasses || 0}</p>
                        </div>
                        <div>
                            <p className="opacity-70 text-xs uppercase tracking-wider font-bold">Total Absents</p>
                            <p className="text-2xl font-bold">{stats?.absents || 0}</p>
                        </div>
                    </div>
                </div>

                {/* 2. Actions Card */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
                    <h3 className="font-bold text-gray-700 mb-2 uppercase text-xs tracking-widest">Quick Actions</h3>
                    <button onClick={() => navigate('/upload')} className="flex items-center p-4 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100 transition">
                        <PlusCircle className="mr-3" /> Update Schedule
                    </button>
                    <button onClick={() => navigate('/setup')} className="flex items-center p-4 bg-gray-50 text-gray-700 rounded-2xl hover:bg-gray-100 transition">
                        <Calendar className="mr-3" /> Semester Dates
                    </button>
                </div>

                {/* 3. Today's Classes List */}
                <div className="col-span-1 md:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Today's Schedule</h3>
                    {todayClasses.length > 0 ? (
                        <div className="space-y-4">
                            {todayClasses.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border border-gray-50 rounded-2xl bg-gray-50/50">
                                    <div>
                                        <p className="font-bold text-gray-800">{item.subject}</p>
                                        <p className="text-sm text-gray-500">{item.startTime} - {item.endTime}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => markAbsent(item.subject)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition flex items-center text-sm font-medium">
                                            <XCircle className="mr-1 w-4 h-4" /> Absent
                                        </button>
                                        <div className="flex items-center text-green-600 text-sm font-medium px-3">
                                            <CheckCircle className="mr-1 w-4 h-4" /> Present
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-3xl">
                            <p className="text-gray-400">No classes scheduled for today or Time-table not uploaded.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;