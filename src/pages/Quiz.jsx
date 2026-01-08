import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
// import { base44 } from '@/api/base44Client'; // Removed unused import
import Timer from '@/components/quiz/Timer';
import ProgressBar from '@/components/quiz/ProgressBar';
import QuestionCard from '@/components/quiz/QuestionCard';
import FillInBlankQuestion from '@/components/quiz/FillInBlankQuestion';
import WordArrangementQuestion from '@/components/quiz/WordArrangementQuestion';
import NeonButton from '@/components/quiz/NeonButton';
import { fetchRandomQuestionsForLevel } from '@/components/quiz/QuestionData';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import useTabSwitchListener from '@/hooks/useTabSwitchListener';

export default function Quiz() {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [quizState, setQuizState] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [levelStartTime, setLevelStartTime] = useState(null);
    const [timerKey, setTimerKey] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // --- Disqualification Logic ---
    const handleDisqualification = useCallback(() => {
        // Only run if we have valid state to save (prevent running on initial load if not ready)
        // actually, if disqualified, we should just blast them to results with a flag.

        // Update state to reflect disqualification if needed, but primarily we want to END it.
        // We'll save what we have so far, maybe? Or just force end.
        // Let's reuse saveAndProceed logic but force a finish, OR just simple navigate.
        // The requirement says "Show the final results page".

        // Let's try to update local storage to say "disqualified" so Results page knows.
        const storedState = localStorage.getItem('quiz_state');
        if (storedState) {
            const state = JSON.parse(storedState);
            const newState = { ...state, disqualified: true, alreadyAttempted: true };
            localStorage.setItem('quiz_state', JSON.stringify(newState));
        }

        navigate(createPageUrl('Results'));
    }, [navigate]);

    const { warningCount, showWarning, setShowWarning } = useTabSwitchListener(
        student?.rollNumber, // Use rollNumber as ID
        3,
        handleDisqualification
    );

    useEffect(() => {
        const storedStudent = localStorage.getItem('quiz_student');
        const storedState = localStorage.getItem('quiz_state');

        if (!storedStudent || !storedState) {
            navigate(createPageUrl('Verify'));
            return;
        }

        const studentData = JSON.parse(storedStudent);
        const state = JSON.parse(storedState);

        // Prevent access if quiz already attempted
        if (state.alreadyAttempted) {
            navigate(createPageUrl('Results'));
            return;
        }

        setStudent(studentData);
        setQuizState(state);

        // Initialize level - load questions dynamically
        const initLevel = async () => {
            try {
                const levelQuestions = await fetchRandomQuestionsForLevel(state.currentLevel);
                setQuestions(levelQuestions);
                setLevelStartTime(Date.now());
                // Question counts: Level 1 = 10, Level 2 = 20, Level 3 = 30
                const answerCount = state.currentLevel === 1 ? 10 : state.currentLevel === 2 ? 20 : 30;
                setAnswers(new Array(answerCount).fill(null));
            } catch (error) {
                console.error("Failed to initialize level:", error);
                // Error is handled by remaining in loading state (or custom error UI could be added)
                // "Prevent quiz start" - implicit since questions are not set
            }
        };

        initLevel();
    }, [navigate]);

    const getTimerDuration = () => {
        return 60; // All levels now have 60 seconds per question
    };

    const handleSelectAnswer = (answerData) => {
        if (isTransitioning) return;
        setSelectedAnswer(answerData);
    };

    const checkAnswer = (userAnswer, question, level) => {
        if (!userAnswer && userAnswer !== 0) return false; // Handle null/undefined

        if (level === 1) {
            // Fill in the blank - normalize and compare
            const normalized = (str) => str ? str.toLowerCase().trim().replace(/\s+/g, ' ') : '';
            return normalized(userAnswer) === normalized(question.fullForm);
        } else if (level === 2) {
            // Word arrangement - normalize and compare
            const normalized = (str) => str ? str.toLowerCase().trim().replace(/\s+/g, ' ') : '';
            const correctAnswer = question.words.join(' ');
            return normalized(userAnswer) === normalized(correctAnswer);
        } else {
            // Multiple choice - check index
            return userAnswer === question.answer;
        }
    };

    const saveAndProceed = useCallback(async (isLevelComplete) => {
        if (isTransitioning) return;

        const newAnswers = [...answers];
        newAnswers[currentQuestion] = selectedAnswer;
        setAnswers(newAnswers);

        const totalQuestions = quizState.currentLevel === 1 ? 10 : quizState.currentLevel === 2 ? 20 : 30;
        if (!isLevelComplete && currentQuestion < totalQuestions - 1) {
            setIsTransitioning(true);
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
            setTimerKey(prev => prev + 1);
            setTimeout(() => setIsTransitioning(false), 100);
        } else {
            // Level complete - calculate score
            const finalAnswers = [...newAnswers];
            finalAnswers[currentQuestion] = selectedAnswer;

            let score = 0;
            const levelResponses = [];

            finalAnswers.forEach((ans, idx) => {
                const q = questions[idx];
                const isCorrect = checkAnswer(ans, q, quizState.currentLevel);
                if (isCorrect) {
                    score++;
                }

                // Construct detailed response for inspection
                let correctAnswerText = '';
                if (quizState.currentLevel === 1) correctAnswerText = q.fullForm;
                else if (quizState.currentLevel === 2) correctAnswerText = q.words.join(' ');
                else correctAnswerText = q.options[q.answer];

                levelResponses.push({
                    question: q.question || q.abbreviation || "Question", // Fallback for diff types
                    answer: ans,
                    isCorrect: isCorrect,
                    correctAnswer: correctAnswerText
                });
            });

            const timeTaken = Math.round((Date.now() - levelStartTime) / 1000);

            // Update quiz state with score AND detailed responses
            // Initialize user_responses object if it doesn't exist
            const existingResponses = quizState.user_responses || {};

            const newState = {
                ...quizState,
                levelScores: [...quizState.levelScores, score],
                levelTimes: [...quizState.levelTimes, timeTaken],
                user_responses: {
                    ...existingResponses,
                    [`level_${quizState.currentLevel}`]: levelResponses
                }
            };
            localStorage.setItem('quiz_state', JSON.stringify(newState));

            // Navigate to summary
            navigate(createPageUrl('Summary') + `?level=${quizState.currentLevel}&score=${score}&time=${timeTaken}`);
        }
    }, [answers, currentQuestion, selectedAnswer, questions, student, quizState, levelStartTime, navigate, isTransitioning]);

    const handleTimeUp = useCallback(() => {
        const totalQuestions = quizState.currentLevel === 1 ? 10 : quizState.currentLevel === 2 ? 20 : 30;
        saveAndProceed(currentQuestion === totalQuestions - 1);
    }, [saveAndProceed, currentQuestion, quizState]);



    const handleNext = () => {
        const totalQuestions = quizState.currentLevel === 1 ? 10 : quizState.currentLevel === 2 ? 20 : 30;
        saveAndProceed(currentQuestion === totalQuestions - 1);
    };

    if (!student || !quizState || questions.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-primary">Loading...</div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];
    const levelNames = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 overflow-hidden relative">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
            </div>

            {/* Warning Overlay */}
            <AnimatePresence>
                {showWarning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-card border border-destructive/50 text-card-foreground p-6 rounded-xl max-w-md w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-destructive/10 animate-pulse pointer-events-none" />
                            <div className="relative z-10 flex flex-col items-center text-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-2">
                                    <AlertTriangle className="w-8 h-8 text-destructive" />
                                </div>
                                <h2 className="text-2xl font-bold text-destructive">Warning {warningCount}/3</h2>
                                <p className="text-muted-foreground">
                                    Switching tabs or minimizing the browser is not allowed.
                                    <br />
                                    <span className="font-semibold text-foreground">
                                        If you reach 4 warnings, you will be disqualified immediately.
                                    </span>
                                </p>
                                <NeonButton
                                    variant="pink"
                                    className="w-full mt-4"
                                    onClick={() => setShowWarning(false)}
                                >
                                    I Understand, Resume Quiz
                                </NeonButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-6"
                >
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-foreground">
                            Level {quizState.currentLevel} - {levelNames[quizState.currentLevel]}
                        </h1>
                    </div>
                    <Timer
                        key={timerKey}
                        duration={getTimerDuration()}
                        onTimeUp={handleTimeUp}
                        isActive={!isTransitioning && !showWarning} // Pause timer when showing warning
                    />
                </motion.div>

                {/* Progress */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <ProgressBar
                        current={currentQuestion + 1}
                        total={quizState.currentLevel === 1 ? 10 : quizState.currentLevel === 2 ? 20 : 30}
                        level={quizState.currentLevel}
                    />
                </motion.div>

                {/* Question */}
                {quizState.currentLevel === 1 ? (
                    <FillInBlankQuestion
                        abbreviation={currentQ.abbreviation}
                        answer={selectedAnswer}
                        onAnswerChange={handleSelectAnswer}
                        questionNumber={currentQuestion + 1}
                    />
                ) : quizState.currentLevel === 2 ? (
                    <WordArrangementQuestion
                        abbreviation={currentQ.abbreviation}
                        words={currentQ.words}
                        distractors={currentQ.distractors}
                        selectedWords={selectedAnswer}
                        onSelectionChange={handleSelectAnswer}
                        questionNumber={currentQuestion + 1}
                    />
                ) : (
                    <QuestionCard
                        question={currentQ.question}
                        options={currentQ.options}
                        selectedAnswer={selectedAnswer}
                        onSelectAnswer={handleSelectAnswer}
                        questionNumber={currentQuestion + 1}
                    />
                )}

                {/* Next button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 flex justify-end gap-4"
                >


                    <NeonButton
                        onClick={handleNext}
                        disabled={
                            isTransitioning ||
                            selectedAnswer === null ||
                            (quizState.currentLevel === 2 && typeof selectedAnswer === 'string' && selectedAnswer.trim() === '')
                        }
                        variant={quizState.currentLevel === 1 ? 'cyan' : quizState.currentLevel === 2 ? 'violet' : 'pink'}
                    >
                        {currentQuestion === (quizState.currentLevel === 1 ? 9 : quizState.currentLevel === 2 ? 19 : 29) ? 'Finish Level' : 'Next Question'}
                        <ArrowRight className="w-5 h-5 ml-2 inline" />
                    </NeonButton>
                </motion.div>
            </div>
        </div>
    );
}