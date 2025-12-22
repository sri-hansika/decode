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
import { getRandomQuestionsForLevel } from '@/components/quiz/QuestionData';
import { ArrowRight } from 'lucide-react';

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

        // Initialize level - get random questions from combined pool
        const levelQuestions = getRandomQuestionsForLevel(state.currentLevel);
        setQuestions(levelQuestions);
        setLevelStartTime(Date.now());
        // Question counts: Level 1 = 10, Level 2 = 20, Level 3 = 30
        const answerCount = state.currentLevel === 1 ? 10 : state.currentLevel === 2 ? 20 : 30;
        setAnswers(new Array(answerCount).fill(null));
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
            finalAnswers.forEach((ans, idx) => {
                if (checkAnswer(ans, questions[idx], quizState.currentLevel)) {
                    score++;
                }
            });

            const timeTaken = Math.round((Date.now() - levelStartTime) / 1000);

            // Update quiz state
            const newState = {
                ...quizState,
                levelScores: [...quizState.levelScores, score],
                levelTimes: [...quizState.levelTimes, timeTaken]
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

    const handleSkip = () => {
        if (isTransitioning) return;

        // Treat as unanswered/incorrect
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = null; // Explicitly null for skipped
        setAnswers(newAnswers);

        const totalQuestions = quizState.currentLevel === 1 ? 10 : quizState.currentLevel === 2 ? 20 : 30;
        if (currentQuestion < totalQuestions - 1) {
            setIsTransitioning(true);
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
            setTimerKey(prev => prev + 1);
            setTimeout(() => setIsTransitioning(false), 100);
        } else {
            // Level complete even if skipped last question
            saveAndProceed(true);
        }
    };

    const handleNext = () => {
        const totalQuestions = quizState.currentLevel === 1 ? 10 : quizState.currentLevel === 2 ? 20 : 30;
        saveAndProceed(currentQuestion === totalQuestions - 1);
    };

    if (!student || !quizState || questions.length === 0) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <div className="animate-pulse text-cyan-400">Loading...</div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];
    const levelNames = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };

    return (
        <div className="min-h-screen bg-[#0D0D0D] p-4 md:p-6 overflow-hidden relative">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-6"
                >
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white">
                            Level {quizState.currentLevel} - {levelNames[quizState.currentLevel]}
                        </h1>
                    </div>
                    <Timer
                        key={timerKey}
                        duration={getTimerDuration()}
                        onTimeUp={handleTimeUp}
                        isActive={!isTransitioning}
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
                        onClick={handleSkip}
                        disabled={isTransitioning}
                        variant="pink" // Distinct color for Skip
                        className="bg-transparent border-pink-500/50 hover:bg-pink-500/10"
                    >
                        Skip
                    </NeonButton>
                    <NeonButton
                        onClick={handleNext}
                        disabled={selectedAnswer === null || isTransitioning}
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