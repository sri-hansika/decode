import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Search, Trophy, Clock, Eye, AlertCircle, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

const AnswerInspectorModal = React.lazy(() => import('@/components/admin/AnswerInspectorModal'));

export default function AdminDashboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedAttempt, setSelectedAttempt] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch users
            const { data: users, error: usersError } = await supabase
                .from('users')
                .select('*');

            if (usersError) throw usersError;

            // Fetch attempts
            const { data: attempts, error: attemptsError } = await supabase
                .from('quiz_attempts')
                .select('*');

            if (attemptsError) throw attemptsError;

            // Merge data
            const merged = users.map(user => {
                const userAttempts = attempts.filter(a => a.user_id === user.id);
                userAttempts.sort((a, b) => b.level - a.level || b.score - a.score);
                const bestAttempt = userAttempts[0];

                return {
                    ...user,
                    score: bestAttempt ? bestAttempt.score : 0,
                    time: bestAttempt ? bestAttempt.time_taken_seconds : 0,
                    levelReached: bestAttempt ? bestAttempt.level : 0,
                    attemptData: bestAttempt
                };
            });

            setStudents(merged);
        } catch (error) {
            console.error("Error fetching admin data:", error);
            setError(error.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedStudents = [...students].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredStudents = sortedStudents.filter(s =>
        (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.roll_number || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewAnswers = (student) => {
        setSelectedStudent(student);
        setSelectedAttempt(student.attemptData);
        setIsModalOpen(true);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Leaderboard & Evaluation
                        </h1>
                        <p className="text-gray-400 mt-1">Real-time student performance monitoring</p>
                    </div>
                </header>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
                        Error: {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center h-64 text-primary">
                        Loading Dashboard...
                    </div>
                ) : (
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                {/* Table Header */}
                                <thead>
                                    <tr className="border-b border-gray-800 bg-gray-900/80 text-gray-400 text-sm uppercase tracking-wider">
                                        <th className="p-4 w-16 text-center">#</th>
                                        <th className="p-4">Student</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Year</th>
                                        <th className="p-4">Score</th>
                                        <th className="p-4">Time</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                {/* Table Body */}
                                <tbody className="divide-y divide-gray-800">
                                    {filteredStudents.map((student, index) => (
                                        <tr key={student.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-center text-gray-500">{index + 1}</td>
                                            <td className="p-4">
                                                <div className="font-semibold">{student.name}</div>
                                                <div className="text-xs text-gray-400">{student.roll_number}</div>
                                            </td>
                                            <td className="p-4 text-gray-300">{student.email || '-'}</td>
                                            <td className="p-4 text-gray-300">{student.year || '-'}</td>
                                            <td className="p-4 font-bold">{student.score}</td>
                                            <td className="p-4 text-gray-400">{formatTime(student.time)}</td>
                                            <td className="p-4">
                                                {student.quiz_status}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleViewAnswers(student)}
                                                    className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <React.Suspense fallback={null}>
                {isModalOpen && (
                    <AnswerInspectorModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        student={selectedStudent}
                        attempt={selectedAttempt}
                    />
                )}
            </React.Suspense>
        </div>
    );
}
