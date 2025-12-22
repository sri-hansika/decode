import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Download, Search, RefreshCw, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function UserLogins() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: logs = [], isLoading, refetch } = useQuery({
        queryKey: ['login-logs'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('login_logs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching logs:', error);
                throw error;
            }
            return data;
        },
    });

    const filteredLogs = logs.filter(log =>
        log.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.roll_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportLoginCSV = () => {
        const headers = [
            'Name',
            'Roll Number',
            'Email ID',
            'Phone Number',
            'College',
            'Branch',
            'Section',
            'Login Timestamp'
        ];

        const rows = filteredLogs.map((log) => [
            log.name || '',
            log.roll_number || '',
            log.email || '',
            log.phone || '',
            log.college || '',
            log.branch || '',
            log.section || '',
            new Date(log.created_at).toLocaleString()
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `decodedesk_login_logs_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Login Tracking</h1>
                        <p className="text-gray-400">Monitor all user login activities</p>
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
                            onClick={() => refetch()}
                            variant="outline"
                            className="border-cyan-700 text-cyan-400 hover:bg-cyan-900/20"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                        <Button
                            onClick={exportLoginCSV}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-500/10 rounded-2xl p-6 border border-cyan-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Total Logins</p>
                                <p className="text-3xl font-bold text-cyan-400">{logs.length}</p>
                            </div>
                            <Clock className="w-10 h-10 text-cyan-400 opacity-50" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-violet-600/20 to-violet-500/10 rounded-2xl p-6 border border-violet-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Unique Students</p>
                                <p className="text-3xl font-bold text-violet-400">
                                    {new Set(logs.map(l => l.roll_number)).size}
                                </p>
                            </div>
                            <Clock className="w-10 h-10 text-violet-400 opacity-50" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-600/20 to-pink-500/10 rounded-2xl p-6 border border-pink-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Today's Logins</p>
                                <p className="text-3xl font-bold text-pink-400">
                                    {logs.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length}
                                </p>
                            </div>
                            <Clock className="w-10 h-10 text-pink-400 opacity-50" />
                        </div>
                    </div>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Search by name, roll number, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-12 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                        />
                    </div>
                </motion.div>

                {/* Logs Table */}
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
                                    <TableHead className="text-gray-400">Name</TableHead>
                                    <TableHead className="text-gray-400">Roll Number</TableHead>
                                    <TableHead className="text-gray-400">Email</TableHead>
                                    <TableHead className="text-gray-400">Phone</TableHead>
                                    <TableHead className="text-gray-400">College</TableHead>
                                    <TableHead className="text-gray-400">Branch</TableHead>
                                    <TableHead className="text-gray-400">Login Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                                            Loading logs...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                                            No login logs found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <TableRow
                                            key={log.id}
                                            className="border-gray-700/50 hover:bg-gray-800/30"
                                        >
                                            <TableCell className="text-white font-medium">
                                                {log.name}
                                            </TableCell>
                                            <TableCell className="text-gray-300">
                                                {log.roll_number}
                                            </TableCell>
                                            <TableCell className="text-gray-400">
                                                {log.email || 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-gray-400">
                                                {log.phone || 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-gray-400 text-sm">
                                                {log.college || 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-gray-400">
                                                {log.branch || 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-gray-400 text-sm">
                                                {new Date(log.created_at).toLocaleString()}
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