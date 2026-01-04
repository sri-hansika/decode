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
            className="bg-card backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl"
        >
            <div className="mb-6">
                <span className="text-primary font-semibold text-sm">
                    Question {questionNumber}
                </span>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    What does <span className="text-primary">{abbreviation}</span> stand for?
                </h2>
                <p className="text-muted-foreground text-sm">
                    Type the full form below
                </p>
            </div>

            <div className="space-y-4">
                <Input
                    type="text"
                    placeholder="Enter full form here..."
                    value={answer || ''}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    className="h-16 text-lg bg-background/50 border-input text-foreground placeholder:text-muted-foreground rounded-xl focus:border-primary focus:ring-primary/20"
                    autoFocus
                />
                <p className="text-xs text-muted-foreground">
                    Example: If abbreviation is "CPU", type "Central Processing Unit"
                </p>
            </div>
        </motion.div>
    );
}