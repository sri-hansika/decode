import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Download,
    Search,
    Trophy,
    Users,
    Clock,
    RefreshCw,
    ArrowUpDown,
    FileSpreadsheet,
    LogIn
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Admin() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('total_score');
    const [sortOrder, setSortOrder] = useState('desc');

    const { data: scores = [], isLoading, refetch } = useQuery({
        queryKey: ['admin-scores'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('quiz_attempts')
                .select('*, users(*)')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data.map(attempt => ({
                ...attempt,
                student_name: attempt.users?.name,
                student_roll: attempt.users?.roll_number,
                student_phone: attempt.users?.phone,
                student_email: attempt.users?.email,
                student_college: attempt.users?.college,
                student_branch: attempt.users?.branch,
                student_section: attempt.users?.section,
                level1_score: attempt.answers?.level1_score,
                level1_time: attempt.answers?.level1_time,
                level2_score: attempt.answers?.level2_score,
                level2_time: attempt.answers?.level2_time,
                level3_score: attempt.answers?.level3_score,
                level3_time: attempt.answers?.level3_time,
                total_score: attempt.score,
                total_time: attempt.time_taken_seconds,
                quiz_status: attempt.answers?.status,
                created_date: attempt.created_at
            }));
        },
    });

    const { data: loginLogs = [] } = useQuery({
        queryKey: ['login-count'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('login_logs')
                .select('*');
            if (error) throw error;
            return data;
        },
    });

    const formatTime = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const filteredScores = scores
        .filter(score =>
            score.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            score.student_roll?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const aVal = a[sortField] || 0;
            const bVal = b[sortField] || 0;
            return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        });

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const exportToCSV = () => {
        const headers = [
            'Name',
            'Roll Number',
            'Phone Number',
            'Email ID',
            'College',
            'Branch',
            'Section',
            'Level 1 Score',
            'Level 1 Time',
            'Level 2 Score',
            'Level 2 Time',
            'Level 3 Score',
            'Level 3 Time',
            'Total Score',
            'Total Time',
            'Quiz Status',
            'Timestamp'
        ];

        const rows = filteredScores.map((score) => [
            score.student_name || '',
            score.student_roll || '',
            score.student_phone || '',
            score.student_email || '',
            score.student_college || '',
            score.student_branch || '',
            score.student_section || '',
            score.level1_score || 0,
            score.level1_time || 0,
            score.level2_score || '',
            score.level2_time || '',
            score.level3_score || '',
            score.level3_time || '',
            score.total_score || 0,
            score.total_time || 0,
            score.quiz_status || '',
            new Date(score.created_date).toLocaleString()
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `decodedesk_admin_results_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const stats = {
        totalParticipants: scores.length,
        avgScore: scores.length > 0
            ? (scores.reduce((a, b) => a + (b.total_score || 0), 0) / scores.length).toFixed(1)
            : 0,
        topScore: scores.length > 0
            ? Math.max(...scores.map(s => s.total_score || 0))
            : 0
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
                    <p className="text-gray-400">Decodedesk Quiz Results Management</p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                >
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50">
                        <LogIn className="w-8 h-8 text-cyan-400 mb-3" />
                        <p className="text-3xl font-bold text-white">{loginLogs.length}</p>
                        <p className="text-gray-400 text-sm">Total Logins</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50">
                        <Users className="w-8 h-8 text-violet-400 mb-3" />
                        <p className="text-3xl font-bold text-white">{stats.totalParticipants}</p>
                        <p className="text-gray-400 text-sm">Quiz Completed</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50">
                        <Trophy className="w-8 h-8 text-amber-400 mb-3" />
                        <p className="text-3xl font-bold text-white">{stats.avgScore}</p>
                        <p className="text-gray-400 text-sm">Average Score</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50">
                        <Trophy className="w-8 h-8 text-pink-400 mb-3" />
                        <p className="text-3xl font-bold text-white">{stats.topScore}/60</p>
                        <p className="text-gray-400 text-sm">Highest Score</p>
                    </div>
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-4 mb-6"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <Input
                            placeholder="Search by name or roll number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <Button
                        onClick={() => refetch()}
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => navigate(createPageUrl('UserLogins'))}
                        variant="outline"
                        className="border-cyan-700 text-cyan-400 hover:bg-cyan-900/20"
                    >
                        <LogIn className="w-4 h-4 mr-2" />
                        Login Logs
                    </Button>
                    <Button
                        onClick={() => navigate(createPageUrl('DetailedResults'))}
                        variant="outline"
                        className="border-violet-700 text-violet-400 hover:bg-violet-900/20"
                    >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        View Detailed
                    </Button>
                    <Button
                        onClick={exportToCSV}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </motion.div>

                {/* Results Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-700 hover:bg-gray-800/50">
                                    <TableHead className="text-gray-400">Rank</TableHead>
                                    <TableHead className="text-gray-400">Name</TableHead>
                                    <TableHead className="text-gray-400">Roll Number</TableHead>
                                    <TableHead className="text-gray-400">Phone</TableHead>
                                    <TableHead className="text-gray-400">College</TableHead>
                                    <TableHead className="text-gray-400">Status</TableHead>
                                    <TableHead
                                        className="text-gray-400 cursor-pointer hover:text-cyan-400"
                                        onClick={() => toggleSort('total_score')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Score
                                            <ArrowUpDown className="w-4 h-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="text-gray-400 cursor-pointer hover:text-cyan-400"
                                        onClick={() => toggleSort('total_time')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Time
                                            <ArrowUpDown className="w-4 h-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-gray-400">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8 text-gray-400">
                                            Loading results...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredScores.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8 text-gray-400">
                                            No results found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredScores.map((score, index) => (
                                        <TableRow
                                            key={score.id}
                                            className="border-gray-700/50 hover:bg-gray-800/30"
                                        >
                                            <TableCell>
                                                <span className={`font-bold ${index === 0 ? 'text-amber-400' :
                                                    index === 1 ? 'text-gray-300' :
                                                        index === 2 ? 'text-amber-600' :
                                                            'text-gray-400'
                                                    }`}>
                                                    #{index + 1}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-white font-medium">
                                                {score.student_name}
                                            </TableCell>
                                            <TableCell className="text-gray-300">
                                                {score.student_roll}
                                            </TableCell>
                                            <TableCell className="text-gray-400">
                                                {score.student_phone || 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-gray-400 text-sm">
                                                {score.student_college || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`text-xs px-2 py-1 rounded ${score.quiz_status === 'ELIMINATED_AFTER_LEVEL_1' || score.quiz_status === 'ELIMINATED_AFTER_LEVEL_2'
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : 'bg-green-500/20 text-green-400'
                                                    }`}>
                                                    {score.quiz_status === 'ELIMINATED_AFTER_LEVEL_1' ? 'Eliminated (L1)' :
                                                        score.quiz_status === 'ELIMINATED_AFTER_LEVEL_2' ? 'Eliminated (L2)' :
                                                            'Qualified'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`font-bold ${score.quiz_status === 'ELIMINATED_AFTER_LEVEL_1' || score.quiz_status === 'ELIMINATED_AFTER_LEVEL_2' ? 'text-red-400' :
                                                    (score.total_score || 0) >= 50 ? 'text-cyan-400' :
                                                        (score.total_score || 0) >= 40 ? 'text-violet-400' :
                                                            (score.total_score || 0) >= 30 ? 'text-amber-400' :
                                                                'text-gray-400'
                                                    }`}>
                                                    {score.total_score || 0}/{score.quiz_status === 'ELIMINATED_AFTER_LEVEL_1' ? 10 : score.quiz_status === 'ELIMINATED_AFTER_LEVEL_2' ? 30 : 60}
                                                </span>
                                                {(score.quiz_status === 'ELIMINATED_AFTER_LEVEL_1' || score.quiz_status === 'ELIMINATED_AFTER_LEVEL_2') && (
                                                    <span className="ml-2 text-xs text-red-400">(Eliminated)</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-gray-300">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4 text-gray-500" />
                                                    {formatTime(score.total_time)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-400 text-sm">
                                                {new Date(score.created_date).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}