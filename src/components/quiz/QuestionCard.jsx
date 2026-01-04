import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionCard({ question, options, selectedAnswer, onSelectAnswer, questionNumber }) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={questionNumber}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
            >
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-border/50 shadow-xl">
                    <div className="mb-8">
                        <span className="text-primary text-sm font-medium mb-2 block">
                            Question {questionNumber}
                        </span>
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
                            {question}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {options.map((option, index) => (
                            <motion.button
                                key={index}
                                onClick={() => onSelectAnswer(index)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${selectedAnswer === index
                                        ? 'bg-primary/20 border-cyan-400 text-primary'
                                        : 'bg-card/50 border-border text-gray-300 hover:border-border hover:bg-accent/50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selectedAnswer === index
                                                ? 'bg-primary text-gray-900'
                                                : 'bg-gray-700 text-muted-foreground'
                                            }`}
                                    >
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span className="flex-1">{option}</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}