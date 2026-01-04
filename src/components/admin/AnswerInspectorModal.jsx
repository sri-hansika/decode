import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, MinusCircle } from 'lucide-react';

export default function AnswerInspectorModal({ isOpen, onClose, student, attempt }) {
    if (!isOpen || !student || !attempt) return null;

    const { breakdown, answers } = attempt.answers || {};

    // Check if detailed user responses are available (feature added recently)
    // If not, we will show a "Data not available" message.

    // For now, let's assume the data structure will be:
    // attempt.answers.userAnswers = [ [l1_ans1, ...], [l2_ans1, ...], [l3_ans1, ...] ] (Or similar)
    // Actually, `quizState` has `levelScores`, maybe I should add `levelAnswers`.

    // Let's write this component to handle "No answers available" gracefully first, 
    // and then I'll add the saving logic in the next steps.

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="text-primary">{student.name}</span>
                                <span className="text-gray-500 text-sm font-normal">({student.roll_number})</span>
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">
                                Total Score: <span className="text-white font-mono">{attempt.score}</span> •
                                Status: <span className={attempt.answers?.status?.includes('QUALIFIED') || attempt.answers?.status === 'COMPLETED' ? 'text-green-400' : 'text-red-400'}>
                                    {attempt.answers?.status?.replace(/_/g, ' ')}
                                </span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {!attempt.answers.user_responses ? (
                            <div className="text-center py-12 text-gray-500">
                                <MinusCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Detailed answer data is not available for this attempt.</p>
                                <p className="text-xs mt-2 opacity-50">(This feature was enabled after this quiz was taken)</p>
                            </div>
                        ) : (
                            // Render answers if available (Future proofing)
                            Object.entries(attempt.answers.user_responses).map(([levelKey, responses], idx) => (
                                <div key={levelKey} className="border border-gray-800 rounded-xl overflow-hidden">
                                    <div className="bg-gray-800/50 px-4 py-3 border-b border-gray-800 flex justify-between items-center">
                                        <h3 className="font-semibold text-white">Level {idx + 1}</h3>
                                        <span className="text-sm font-mono text-gray-400">
                                            Score: {attempt.answers.breakdown?.levelScores[idx] || 0}
                                        </span>
                                    </div>
                                    <div className="divide-y divide-gray-800">
                                        {responses.map((resp, i) => (
                                            <div key={i} className="p-4 hover:bg-white/5 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1">
                                                        {resp.isCorrect ? (
                                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                                        ) : (
                                                            <XCircle className="w-5 h-5 text-red-500" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-gray-300 text-sm mb-1 font-medium">Question {i + 1}</p>
                                                        <p className="text-white mb-1">{resp.question || "Question Text Unavailable"}</p>
                                                        <div className="flex gap-4 text-sm mt-2">
                                                            <div className={`px-2 py-1 rounded ${resp.isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                                Given: {Array.isArray(resp.answer) ? resp.answer.join(' ') : (resp.answer?.toString() || "(No Answer)")}
                                                            </div>
                                                            {!resp.isCorrect && (
                                                                <div className="px-2 py-1 rounded bg-blue-500/10 text-blue-400">
                                                                    Correct: {resp.correctAnswer}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
