import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

export default function FillInBlankQuestion({
    abbreviation,
    answer,
    onAnswerChange,
    questionNumber
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl"
        >
            <div className="mb-6">
                <span className="text-cyan-400 font-semibold text-sm">
                    Question {questionNumber}
                </span>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    What does <span className="text-cyan-400">{abbreviation}</span> stand for?
                </h2>
                <p className="text-gray-400 text-sm">
                    Type the full form below
                </p>
            </div>

            <div className="space-y-4">
                <Input
                    type="text"
                    placeholder="Enter full form here..."
                    value={answer || ''}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    className="h-16 text-lg bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 rounded-xl focus:border-cyan-400 focus:ring-cyan-400/20"
                    autoFocus
                />
                <p className="text-xs text-gray-500">
                    Example: If abbreviation is "CPU", type "Central Processing Unit"
                </p>
            </div>
        </motion.div>
    );
}