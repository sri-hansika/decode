import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function DetailedResults() {
    const navigate = useNavigate();

    const { data: scores = [], isLoading } = useQuery({
        queryKey: ['detailed-scores'],
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
                student_section: attempt.users?.section || '', // Schema might not have section in users? I added it in Verify but schema.sql didn't show it explicitly for users initially, only log. Checking schema... I'll just map safe.
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

    const formatTime = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const exportDetailedCSV = () => {
        const headers = [
            'Name',
            'Roll Number',
            'Phone Number',
            'Email ID',
            'College',
            'Branch',
            'Section',
            'Level 1 Score (out of 10)',
            'Level 1 Time (sec)',
            'Level 2 Score (out of 20)',
            'Level 2 Time (sec)',
            'Level 3 Score (out of 30)',
            'Level 3 Time (sec)',
            'Total Score (out of 60)',
            'Total Time (sec)',
            'Quiz Status',
            'Timestamp'
        ];

        const rows = scores.map((score) => [
            score.student_name || '',
            score.student_roll || '',
            score.student_phone || '',
            score.student_email || '',
            score.student_college || '',
            score.student_branch || '',
            score.student_section || '',
            score.level1_score || 0,
            score.level1_time || 0,
            score.level2_score !== null && score.level2_score !== undefined ? score.level2_score : '',
            score.level2_time !== null && score.level2_time !== undefined ? score.level2_time : '',
            score.level3_score !== null && score.level3_score !== undefined ? score.level3_score : '',
            score.level3_time !== null && score.level3_time !== undefined ? score.level3_time : '',
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
        a.download = `decodedesk_detailed_results_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const sortedScores = [...scores].sort((a, b) => (b.total_score || 0) - (a.total_score || 0));

    return (
        <div className="min-h-screen bg-[#0D0D0D] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex justify-between items-center"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Detailed Results</h1>
                        <p className="text-gray-400">Complete breakdown of all quiz attempts</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => navigate(createPageUrl('Admin'))}
                            variant="outline"
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                            Back to Dashboard
                        </Button>
                        <Button
                            onClick={exportDetailedCSV}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export Detailed CSV
                        </Button>
                    </div>
                </motion.div>

                {/* Results Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-700 hover:bg-gray-800/50">
                                    <TableHead className="text-gray-400 sticky left-0 bg-gray-900">Student Info</TableHead>
                                    <TableHead className="text-center text-cyan-400" colSpan={2}>Level 1 - Easy</TableHead>
                                    <TableHead className="text-center text-violet-400" colSpan={2}>Level 2 - Medium</TableHead>
                                    <TableHead className="text-center text-pink-400" colSpan={2}>Level 3 - Hard</TableHead>
                                    <TableHead className="text-center text-amber-400" colSpan={2}>Total</TableHead>
                                </TableRow>
                                <TableRow className="border-gray-700 hover:bg-gray-800/50">
                                    <TableHead className="text-gray-400 sticky left-0 bg-gray-900">Name / Roll</TableHead>
                                    <TableHead className="text-gray-400 text-center">Score</TableHead>
                                    <TableHead className="text-gray-400 text-center">Time</TableHead>
                                    <TableHead className="text-gray-400 text-center">Score</TableHead>
                                    <TableHead className="text-gray-400 text-center">Time</TableHead>
                                    <TableHead className="text-gray-400 text-center">Score</TableHead>
                                    <TableHead className="text-gray-400 text-center">Time</TableHead>
                                    <TableHead className="text-gray-400 text-center">Score</TableHead>
                                    <TableHead className="text-gray-400 text-center">Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8 text-gray-400">
                                            Loading results...
                                        </TableCell>
                                    </TableRow>
                                ) : sortedScores.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8 text-gray-400">
                                            No results found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedScores.map((score, index) => (
                                        <TableRow
                                            key={score.id}
                                            className="border-gray-700/50 hover:bg-gray-800/30"
                                        >
                                            <TableCell className="sticky left-0 bg-gray-900">
                                                <div>
                                                    <p className="text-white font-medium">{score.student_name}</p>
                                                    <p className="text-gray-500 text-sm">{score.student_roll}</p>
                                                    <p className="text-gray-600 text-xs">{score.student_phone}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center text-cyan-400 font-semibold">
                                                {score.level1_score || 0}/10
                                            </TableCell>
                                            <TableCell className="text-center text-gray-400 text-sm">
                                                {formatTime(score.level1_time)}
                                            </TableCell>
                                            <TableCell className="text-center text-violet-400 font-semibold">
                                                {score.level2_score !== null && score.level2_score !== undefined ? `${score.level2_score}/20` : '-'}
                                            </TableCell>
                                            <TableCell className="text-center text-gray-400 text-sm">
                                                {score.level2_time ? formatTime(score.level2_time) : '-'}
                                            </TableCell>
                                            <TableCell className="text-center text-pink-400 font-semibold">
                                                {score.level3_score !== null && score.level3_score !== undefined ? `${score.level3_score}/30` : '-'}
                                            </TableCell>
                                            <TableCell className="text-center text-gray-400 text-sm">
                                                {score.level3_time ? formatTime(score.level3_time) : '-'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className={`font-bold ${(score.total_score || 0) >= 50 ? 'text-amber-400' :
                                                    (score.total_score || 0) >= 40 ? 'text-cyan-400' :
                                                        (score.total_score || 0) >= 30 ? 'text-violet-400' :
                                                            'text-gray-400'
                                                    }`}>
                                                    {score.total_score || 0}/60
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center text-gray-400 text-sm">
                                                {formatTime(score.total_time)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </motion.div>

                {/* Info box */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-xl p-4 border border-cyan-500/20"
                >
                    <div className="flex items-start gap-3">
                        <FileSpreadsheet className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-white font-medium mb-1">Export Format</p>
                            <p className="text-gray-400 text-sm">
                                The exported CSV includes all student details, individual level scores, times, and totals.
                                This format can be directly imported into Google Sheets for further analysis.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}