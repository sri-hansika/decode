import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Trophy, Clock, Target, ArrowRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import NeonButton from '@/components/quiz/NeonButton';
import { supabase } from '@/lib/supabase';

export default function Summary() {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const level = parseInt(urlParams.get('level') || '1');
    const score = parseInt(urlParams.get('score') || '0');
    const time = parseInt(urlParams.get('time') || '0');

    const [student, setStudent] = useState(null);
    const [quizState, setQuizState] = useState(null);

    useEffect(() => {
        const storedStudent = localStorage.getItem('quiz_student');
        const storedState = localStorage.getItem('quiz_state');

        if (!storedStudent || !storedState) {
            navigate(createPageUrl('Verify'));
            return;
        }

        setStudent(JSON.parse(storedStudent));
        setQuizState(JSON.parse(storedState));
    }, [navigate]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins} min ${secs} sec`;
    };

    const handleNext = async () => {
        // Check Level 1 cutoff - DISABLED FOR DEBUGGING
        // if (level === 1 && score < 5) {
        //     // Student is eliminated - save final results and show elimination screen
        //     try {
        //         await supabase.from('quiz_attempts').insert({
        //             user_id: student.id,
        //             level: 1,
        //             score: score,
        //             time_taken_seconds: time,
        //             answers: {
        //                 level1_score: score,
        //                 level1_time: time,
        //                 status: 'ELIMINATED_AFTER_LEVEL_1',
        //                 breakdown: { levelScores: [score], levelTimes: [time] }
        //             }
        //         });
        //     } catch (err) {
        //         console.error('Error saving elimination results:', err);
        //     }

        //     // Update state to mark as eliminated
        //     const newState = {
        //         ...quizState,
        //         eliminated: true,
        //         eliminationLevel: 1
        //     };
        //     localStorage.setItem('quiz_state', JSON.stringify(newState));

        //     // Navigate to Results page (will show elimination message)
        //     navigate(createPageUrl('Results'));
        //     return;
        // }

        // Check Level 2 cutoff - DISABLED FOR DEBUGGING
        // if (level === 2 && score < 18) {
        //     // Student is eliminated after Level 2 - save final results
        //     try {
        //         const totalScore = quizState.levelScores[0] + score;
        //         const totalTime = quizState.levelTimes[0] + time;

        //         await supabase.from('quiz_attempts').insert({
        //             user_id: student.id,
        //             level: 2,
        //             score: totalScore,
        //             time_taken_seconds: totalTime,
        //             answers: {
        //                 level1_score: quizState.levelScores[0],
        //                 level1_time: quizState.levelTimes[0],
        //                 level2_score: score,
        //                 level2_time: time,
        //                 status: 'ELIMINATED_AFTER_LEVEL_2',
        //                 breakdown: {
        //                     levelScores: [...quizState.levelScores, score],
        //                     levelTimes: [...quizState.levelTimes, time]
        //                 }
        //             }
        //         });
        //     } catch (err) {
        //         console.error('Error saving elimination results:', err);
        //     }

        //     // Update state to mark as eliminated
        //     const newState = {
        //         ...quizState,
        //         eliminated: true,
        //         eliminationLevel: 2
        //     };
        //     localStorage.setItem('quiz_state', JSON.stringify(newState));

        //     // Navigate to Results page (will show elimination message)
        //     navigate(createPageUrl('Results'));
        //     return;
        // }

        if (level < 3) {
            // Update state for next level
            const newState = {
                ...quizState,
                currentLevel: level + 1
            };
            localStorage.setItem('quiz_state', JSON.stringify(newState));
            navigate(createPageUrl('Quiz'));
        } else {
            // Final results
            navigate(createPageUrl('Results'));
        }
    };

    const levelNames = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
    const levelColors = { 1: 'cyan', 2: 'violet', 3: 'pink' };

    if (!student || !quizState) return null;

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-6 overflow-hidden relative">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-lg"
            >
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl text-center">
                    {/* Level badge */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${levelColors[level]}-500/20 border border-${levelColors[level]}-500/30 mb-6`}
                    >
                        <span className={`text-${levelColors[level]}-400 font-semibold`}>
                            Level {level} Complete - {levelNames[level]}
                        </span>
                    </motion.div>

                    {/* Score display */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                        className="mb-8"
                    >
                        <div className="text-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mb-2"
                            >
                                <span className="text-5xl font-bold text-cyan-400">{score}</span>
                                <span className="text-3xl text-gray-500"> / {level === 1 ? 10 : level === 2 ? 20 : 30}</span>
                            </motion.div>
                            <p className="text-gray-400 text-sm">Level {level} Score</p>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="mb-8"
                    >
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                            <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                            <p className="text-xl font-bold text-white">{formatTime(time)}</p>
                            <p className="text-gray-500 text-sm">Time Taken</p>
                        </div>
                    </motion.div>

                    {/* Progress indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                        className="flex items-center justify-center gap-4 mb-8"
                    >
                        {[1, 2, 3].map((l) => (
                            <div
                                key={l}
                                className={`flex items-center gap-2 ${l <= level ? 'text-cyan-400' : 'text-gray-600'
                                    }`}
                            >
                                {l < level ? (
                                    <CheckCircle className="w-6 h-6" />
                                ) : l === level ? (
                                    <CheckCircle className="w-6 h-6" />
                                ) : (
                                    <XCircle className="w-6 h-6" />
                                )}
                                <span className="text-sm font-medium">L{l}</span>
                                {l < 3 && (
                                    <div className={`w-8 h-0.5 ${l < level ? 'bg-cyan-400' : 'bg-gray-700'}`} />
                                )}
                            </div>
                        ))}
                    </motion.div>

                    {/* Elimination Warning (Level 1 and Level 2) - DISABLED FOR DEBUGGING */}
                    {/* {level === 1 && score < 5 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4 }}
                            className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3"
                        >
                            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-400 font-semibold">Not Qualified</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    You need at least 5 marks to proceed to Level 2.
                                </p>
                            </div>
                        </motion.div>
                    )} */}

                    {/* {level === 2 && score < 18 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4 }}
                            className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3"
                        >
                            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-400 font-semibold">Not Qualified</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    You need at least 18 marks to proceed to Level 3.
                                </p>
                            </div>
                        </motion.div>
                    )} */}

                    {/* Next button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6 }}
                    >
                        <NeonButton
                            onClick={handleNext}
                            variant={(level === 1 && score < 5) || (level === 2 && score < 18) ? 'pink' : level === 1 ? 'violet' : level === 2 ? 'pink' : 'cyan'}
                            className="w-full"
                        >
                            {(level === 1 && score < 5) || (level === 2 && score < 18) ? (
                                <>
                                    View Final Results
                                    <XCircle className="w-5 h-5 ml-2 inline" />
                                </>
                            ) : level < 3 ? (
                                <>
                                    Start Level {level + 1} - {levelNames[level + 1]}
                                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                                </>
                            ) : (
                                <>
                                    View Final Results
                                    <Trophy className="w-5 h-5 ml-2 inline" />
                                </>
                            )}
                        </NeonButton>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}