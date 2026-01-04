import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User, Hash, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import NeonButton from '@/components/quiz/NeonButton';
import { supabase } from '@/lib/supabase';

// Google Sheet URL for fetching registrations
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1rPt0x3yCY2g-Q1e-JienM9LYT1SsUs9GkLlP6mlJxNY/export?format=csv';

export default function Verify() {
    const navigate = useNavigate();
    const [rollNumber, setRollNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const parseCSV = (csvText) => {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;

            const values = [];
            let currentValue = '';
            let insideQuotes = false;

            for (let char of lines[i]) {
                if (char === '"') {
                    insideQuotes = !insideQuotes;
                } else if (char === ',' && !insideQuotes) {
                    values.push(currentValue.trim());
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }
            values.push(currentValue.trim());

            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            data.push(row);
        }
        return data;
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Fetch registration data from Google Sheet
            const response = await fetch(SHEET_URL);
            const csvText = await response.text();
            const registrations = parseCSV(csvText);

            // Find matching registration by Roll Number only (case-insensitive)
            const normalizedRoll = rollNumber.trim().toUpperCase();

            const matchedUser = registrations.find(reg => {
                const regRoll = (reg['roll number'] || '').trim().toUpperCase();
                return regRoll === normalizedRoll;
            });

            if (matchedUser) {
                // Create or update student in database
                const studentData = {
                    name: matchedUser['name(as you want it to be reflected on your certificate)'] || matchedUser['name'] || 'Unknown',
                    roll_number: matchedUser['roll number'] || rollNumber,
                    phone: matchedUser['phone number'] || '',
                    email: matchedUser['email'] || '',
                    college: matchedUser['college'] || '',
                    branch: matchedUser['branch'] || '',
                    year: matchedUser['year'] || '',
                    section: matchedUser['section'] || '',
                };

                // Upsert user to Supabase
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .upsert(studentData, { onConflict: 'roll_number' })
                    .select()
                    .single();

                if (userError) throw userError;

                const student = userData;


                // Resume logic based on quiz_status
                const quizStatus = student.quiz_status || 'NOT_STARTED';

                // Base student object for localStorage
                const studentStorageData = {
                    id: student.id,
                    name: student.name,
                    roll_number: student.roll_number,
                    phone: studentData.phone,
                    email: student.email,
                    college: student.college,
                    branch: student.branch
                };

                // Helper to set local storage and navigate
                const resumeSession = (path, state) => {
                    localStorage.setItem('quiz_student', JSON.stringify(studentStorageData));
                    if (state) {
                        localStorage.setItem('quiz_state', JSON.stringify(state));
                    }

                    setSuccess(true);
                    setTimeout(() => {
                        navigate(createPageUrl(path) + (state && state.queryParams ? state.queryParams : ''));
                    }, 1000);
                };

                // CASE 1: Not started
                if (quizStatus === 'NOT_STARTED') {
                    // Initialize fresh state
                    const initialState = {
                        currentLevel: 1,
                        levelScores: [],
                        levelTimes: [],
                        eliminated: false
                    };
                    resumeSession('Instructions', initialState);

                    // Log the login for fresh starts
                    await supabase.from('login_logs').insert({
                        name: student.name,
                        roll_number: student.roll_number,
                        email: student.email,
                        phone: studentData.phone,
                        college: student.college,
                        branch: student.branch,
                        section: studentData.section
                    });
                    return;
                }

                // Parse metadata for restoring state
                let restoredState = student.quiz_metadata || {
                    currentLevel: 1,
                    levelScores: [],
                    levelTimes: [],
                    eliminated: false
                };

                // CASE 2: Qualified Easy -> Go to Easy Results (Summary)
                if (quizStatus === 'QUALIFIED_EASY') {
                    // Ensure state reflects completion of level 1
                    restoredState.currentLevel = 1; // Used by Summary to render Level 1 stats
                    const score = restoredState.levelScores[0] || 0;
                    const time = restoredState.levelTimes[0] || 0;
                    restoredState.queryParams = `?level=1&score=${score}&time=${time}`;

                    resumeSession('Summary', restoredState);
                    return;
                }

                // CASE 3: Qualified Medium -> Go to Medium Results (Summary)
                if (quizStatus === 'QUALIFIED_MEDIUM') {
                    // Ensure state reflects completion of level 2
                    restoredState.currentLevel = 2; // Used by Summary to render Level 2 stats
                    const score = restoredState.levelScores[1] || 0;
                    const time = restoredState.levelTimes[1] || 0;
                    restoredState.queryParams = `?level=2&score=${score}&time=${time}`;

                    resumeSession('Summary', restoredState);
                    return;
                }

                // CASE 4: Disqualified (Level 1 or Level 2)
                if (quizStatus === 'ELIMINATED_AFTER_LEVEL_1' || quizStatus === 'ELIMINATED_AFTER_LEVEL_2') {
                    restoredState.eliminated = true;
                    restoredState.eliminationLevel = quizStatus === 'ELIMINATED_AFTER_LEVEL_1' ? 1 : 2;
                    resumeSession('Results', restoredState);
                    return;
                }

                // CASE 5: Completed Hard (All Finished)
                if (quizStatus === 'COMPLETED') {
                    restoredState.alreadyAttempted = true; // Mark as done to prevent re-save or edits
                    resumeSession('Results', restoredState);
                    return;
                }

                // Fallback for unknown states (treat as resuming at last known point or results)
                resumeSession('Results', restoredState);


            } else {
                setError('You are not registered for this event. Please check your roll number.');
            }
        } catch (err) {
            console.error('Verification error:', err);
            setError('Unable to verify registration. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-6 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                    <div className="text-center mb-8">
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-bold text-white mb-2"
                        >
                            Welcome
                        </motion.h1>
                        <p className="text-gray-400">
                            Enter your registered roll number to continue
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <Input
                                    type="text"
                                    placeholder="Enter your roll number"
                                    value={rollNumber}
                                    onChange={(e) => setRollNumber(e.target.value)}
                                    className="pl-12 h-14 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 rounded-xl focus:border-cyan-400 focus:ring-cyan-400/20"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                            >
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
                            >
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <p className="text-green-400 text-sm">Verified! Redirecting...</p>
                            </motion.div>
                        )}

                        <NeonButton
                            type="submit"
                            disabled={loading || !rollNumber}
                            className="w-full"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verifying...
                                </span>
                            ) : (
                                'Continue'
                            )}
                        </NeonButton>
                    </form>

                    <p className="mt-6 text-center text-gray-500 text-sm">
                        Only registered participants can access the quiz
                    </p>
                </div>
            </motion.div>
        </div>
    );
}