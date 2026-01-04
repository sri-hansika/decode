import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { supabase } from '@/lib/supabase';
import { Clock, Layers, Award, AlertTriangle, CheckCircle2, ArrowRight, XCircle } from 'lucide-react';
import NeonButton from '@/components/quiz/NeonButton';

export default function Instructions() {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const storedStudent = localStorage.getItem('quiz_student');
        if (!storedStudent) {
            navigate(createPageUrl('Verify'));
            return;
        }

        const studentData = JSON.parse(storedStudent);
        setStudent(studentData);

        // Check if user has already attempted the quiz
        const checkExistingAttempt = async () => {
            try {
                const { data: existingAttempts, error } = await supabase
                    .from('quiz_attempts')
                    .select('*')
                    .eq('user_id', studentData.id);

                if (error) throw error;

                if (existingAttempts && existingAttempts.length > 0) {
                    // User has already attempted - redirect to results
                    // We need to reconstruct the state from the stored answer in Supabase if we want to show it perfectly,
                    // but for now, just redirecting with a flag is safe, or we use the data we have.
                    // The original code tried to reconstruct detailed state.
                    const attempt = existingAttempts[0];
                    const answers = attempt.answers || {};

                    const quizState = {
                        currentLevel: 1,
                        levelScores: answers.levelScores || [],
                        levelTimes: answers.levelTimes || [],
                        eliminated: answers.status === 'ELIMINATED_AFTER_LEVEL_1' || answers.status === 'ELIMINATED_AFTER_LEVEL_2',
                        eliminationLevel: answers.status === 'ELIMINATED_AFTER_LEVEL_1' ? 1 :
                            answers.status === 'ELIMINATED_AFTER_LEVEL_2' ? 2 : null,
                        alreadyAttempted: true
                    };
                    localStorage.setItem('quiz_state', JSON.stringify(quizState));
                    navigate(createPageUrl('Results'));
                }
            } catch (err) {
                console.error('Error checking existing attempts:', err);
            }
        };

        checkExistingAttempt();
    }, [navigate]);


    const startQuiz = () => {
        // Initialize quiz state
        localStorage.setItem('quiz_state', JSON.stringify({
            currentLevel: 1,
            levelScores: [],
            levelTimes: [],
            levelSets: [],
            startTime: Date.now()
        }));
        navigate(createPageUrl('Quiz'));
    };

    const instructions = [
        {
            icon: Layers,
            title: '3 Levels',
            description: 'Easy → Medium → Hard',
            color: 'text-primary'
        },
        {
            icon: Clock,
            title: 'Question Count',
            description: 'L1: 10 | L2: 20 | L3: 30',
            color: 'text-secondary'
        },
        {
            icon: Award,
            title: 'Total Score',
            description: '60 Questions | 60 Marks',
            color: 'text-accent'
        }
    ];

    const rules = [
        'Level 1 (Easy): 10 questions, 60 seconds per question. Minimum 5/10 to qualify for Level 2.',
        'Level 2 (Medium): 20 questions, 60 seconds per question. Minimum 18/20 to qualify for Level 3.',
        'Level 3 (Hard): 30 questions, 60 seconds per question.',
        'If you do not meet the cutoff, you will be disqualified immediately.',
        'Only ONE attempt is allowed. Reattempt is not permitted under any condition.',
        'You cannot go back to previous questions.',
        'Auto-submission when timer expires.',
        'Only your score and time will be displayed (no grades).'
    ];

    if (!student) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 overflow-hidden relative">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-2xl"
            >
                {/* Welcome card */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card rounded-2xl p-6 mb-6 border border-border"
                >
                    <p className="text-muted-foreground text-sm">Welcome,</p>
                    <h2 className="text-2xl font-bold text-foreground">{student.name}</h2>
                    <p className="text-muted-foreground text-sm mt-1">{student.roll_number}</p>
                </motion.div>

                {/* Instructions card */}
                <div className="bg-card backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl">
                    <h1 className="text-3xl font-bold text-foreground mb-6 text-center">
                        Quiz Instructions
                    </h1>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {instructions.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="bg-muted/50 rounded-xl p-4 text-center border border-border"
                            >
                                <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color}`} />
                                <h3 className="text-foreground font-semibold text-sm">{item.title}</h3>
                                <p className="text-muted-foreground text-xs mt-1">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Rules */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-accent" />
                            <h3 className="text-lg font-semibold text-foreground">Important Rules</h3>
                        </div>
                        <div className="space-y-3">
                            {rules.map((rule, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <p className="text-muted-foreground text-sm">{rule}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Start button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                    >
                        <NeonButton
                            onClick={startQuiz}
                            className="w-full flex items-center justify-center gap-2"
                        >
                            Start Level 1 - Easy
                            <ArrowRight className="w-5 h-5" />
                        </NeonButton>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}