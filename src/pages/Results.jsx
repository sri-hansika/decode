import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { supabase } from '@/lib/supabase';
import { Trophy, Clock, Award, Star, LogOut, Home, XCircle } from 'lucide-react';
import NeonButton from '@/components/quiz/NeonButton';
import confetti from 'canvas-confetti';

export default function Results() {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [quizState, setQuizState] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const storedStudent = localStorage.getItem('quiz_student');
        const storedState = localStorage.getItem('quiz_state');

        if (!storedStudent || !storedState) {
            navigate(createPageUrl('Verify'));
            return;
        }

        const studentData = JSON.parse(storedStudent);
        const stateData = JSON.parse(storedState);

        setStudent(studentData);
        setQuizState(stateData);

        // Save final results (only if not already eliminated or already attempted)
        const saveFinalResults = async () => {
            // Don't save if already attempted (viewing past results)
            if (stateData.alreadyAttempted) {
                setSaved(true);
                return;
            }

            // Check if student was eliminated after Level 1 or Level 2
            if (stateData.eliminated && (stateData.eliminationLevel === 1 || stateData.eliminationLevel === 2)) {
                setSaved(true);
                return; // Already saved in Summary page
            }

            const totalScore = stateData.levelScores.reduce((a, b) => a + b, 0);
            const totalTime = stateData.levelTimes.reduce((a, b) => a + b, 0);

            try {
                await supabase.from('quiz_attempts').insert({
                    user_id: studentData.id,
                    level: 3, // Completed all levels
                    score: totalScore,
                    time_taken_seconds: totalTime,
                    answers: {
                        level1_score: stateData.levelScores[0] || 0,
                        level1_time: stateData.levelTimes[0] || 0,
                        level2_score: stateData.levelScores[1] || 0,
                        level2_time: stateData.levelTimes[1] || 0,
                        level3_score: stateData.levelScores[2] || 0,
                        level3_time: stateData.levelTimes[2] || 0,
                        status: 'COMPLETED',
                        breakdown: {
                            levelScores: stateData.levelScores,
                            levelTimes: stateData.levelTimes
                        }
                    }
                });
                setSaved(true);
            } catch (err) {
                console.error('Error saving final results:', err);
            }
        };

        if (!saved) {
            saveFinalResults();
        }

        // Trigger confetti
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#d00000', '#f48c06', '#ffba08']
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#d00000', '#f48c06', '#ffba08']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, [navigate, saved]);

    const handleLogout = () => {
        localStorage.removeItem('quiz_student');
        localStorage.removeItem('quiz_state');
        navigate(createPageUrl('Home'));
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins} min ${secs} sec`;
    };

    if (!student || !quizState) return null;

    const isEliminated = quizState.eliminated && (quizState.eliminationLevel === 1 || quizState.eliminationLevel === 2);
    const eliminationLevel = quizState.eliminationLevel;

    let totalScore, totalTime;
    if (quizState.eliminationLevel === 1) {
        totalScore = quizState.levelScores[0];
        totalTime = quizState.levelTimes[0];
    } else if (quizState.eliminationLevel === 2) {
        totalScore = quizState.levelScores[0] + quizState.levelScores[1];
        totalTime = quizState.levelTimes[0] + quizState.levelTimes[1];
    } else {
        totalScore = quizState.levelScores.reduce((a, b) => a + b, 0);
        totalTime = quizState.levelTimes.reduce((a, b) => a + b, 0);
    }

    const levelNames = ['Easy', 'Medium', 'Hard'];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 overflow-hidden relative">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-500" />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-2xl"
            >
                <div className="bg-card backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl">
                    {/* Already Attempted Warning */}
                    {quizState.alreadyAttempted && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center"
                        >
                            <p className="text-yellow-500 font-semibold">
                                You have already attempted the quiz. Showing your previous results.
                            </p>
                        </motion.div>
                    )}

                    {/* Header */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="text-center mb-8"
                    >
                        {quizState.alreadyAttempted ? (
                            <>
                                <div className="w-24 h-24 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30">
                                    <Trophy className="w-12 h-12 text-yellow-500" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                    Previous Results
                                </h1>
                                <p className="text-muted-foreground">
                                    Welcome back, {student.name}. Here is how you performed.
                                </p>
                            </>
                        ) : isEliminated ? (
                            <>
                                <div className="w-24 h-24 mx-auto mb-4 bg-destructive/20 rounded-full flex items-center justify-center border border-destructive/30">
                                    <XCircle className="w-12 h-12 text-destructive" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                    Not Qualified
                                </h1>
                                <p className="text-muted-foreground">
                                    {student.name}, you did not meet the qualification criteria.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-24 h-24 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                                    <Trophy className="w-12 h-12 text-primary" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                    Quiz Complete!
                                </h1>
                                <p className="text-muted-foreground">
                                    Congratulations, {student.name}!
                                </p>
                            </>
                        )}
                    </motion.div>

                    {/* Final Score */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center mb-8"
                    >
                        <div className="text-6xl font-black text-primary mb-2">
                            {totalScore} / {eliminationLevel === 1 ? 10 : eliminationLevel === 2 ? 30 : 60}
                        </div>
                        <p className="text-lg text-muted-foreground">
                            {eliminationLevel === 1 ? 'Level 1 Score' : eliminationLevel === 2 ? 'Total Score (L1+L2)' : 'Total Score'}
                        </p>
                    </motion.div>

                    {/* Total Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-2 gap-4 mb-8"
                    >
                        <div className="bg-primary/20 rounded-2xl p-6 border border-primary/30 text-center">
                            <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                            <p className="text-4xl font-bold text-foreground">{totalScore}/{eliminationLevel === 1 ? 10 : eliminationLevel === 2 ? 30 : 60}</p>
                            <p className="text-muted-foreground text-sm">{eliminationLevel === 1 ? 'Level 1 Score' : eliminationLevel === 2 ? 'Total (L1+L2)' : 'Total Score'}</p>
                        </div>
                        <div className="bg-secondary/20 rounded-2xl p-6 border border-secondary/30 text-center">
                            <Clock className="w-8 h-8 text-secondary mx-auto mb-2" />
                            <p className="text-4xl font-bold text-foreground">{formatTime(totalTime)}</p>
                            <p className="text-muted-foreground text-sm">{eliminationLevel === 1 ? 'Level 1 Time' : eliminationLevel === 2 ? 'Total (L1+L2)' : 'Total Time'}</p>
                        </div>
                    </motion.div>

                    {/* Level Breakdown / Elimination Message */}
                    {isEliminated ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="mb-8 bg-destructive/10 border border-destructive/30 rounded-xl p-6"
                        >
                            <div className="flex items-start gap-3">
                                <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-lg font-semibold text-destructive mb-2">
                                        Qualification Not Met
                                    </h3>
                                    {eliminationLevel === 1 ? (
                                        <p className="text-muted-foreground text-sm">
                                            You needed at least 5 marks in Level 1 to proceed to Level 2.
                                            You scored {quizState.levelScores[0]}/10 in Level 1.
                                        </p>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">
                                            You needed at least 18 marks in Level 2 to proceed to Level 3.
                                            You scored {quizState.levelScores[1]}/20 in Level 2.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="mb-8"
                        >
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5 text-secondary" />
                                Level Breakdown
                            </h3>
                            <div className="space-y-3">
                                {quizState.levelScores.map((score, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between bg-muted/50 rounded-xl p-4 border border-border"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i === 0 ? 'bg-primary/20 text-primary' :
                                                i === 1 ? 'bg-secondary/20 text-secondary' :
                                                    'bg-accent/20 text-accent'
                                                }`}>
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="text-foreground font-medium">Level {i + 1} - {levelNames[i]}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-foreground font-bold">{score}/{i === 0 ? 10 : i === 1 ? 20 : 30}</p>
                                            <p className="text-muted-foreground text-sm">{formatTime(quizState.levelTimes[i])}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <NeonButton
                            onClick={handleLogout}
                            variant="violet"
                            className="flex-1 flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </NeonButton>
                        <NeonButton
                            onClick={() => navigate(createPageUrl('Home'))}
                            variant="cyan"
                            className="flex-1 flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Back to Home
                        </NeonButton>
                    </motion.div>
                </div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="text-center text-muted-foreground text-sm mt-6"
                >
                    {quizState.alreadyAttempted ? (
                        'Your past quiz results are displayed above. Reattempt is not allowed.'
                    ) : isEliminated ? (
                        'Your results have been saved. Better luck next time!'
                    ) : (
                        'Your results have been saved. Thank you for participating!'
                    )}
                </motion.p>
            </motion.div>
        </div>
    );
}