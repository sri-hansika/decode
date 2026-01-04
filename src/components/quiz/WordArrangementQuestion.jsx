import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';

export default function WordArrangementQuestion({
    abbreviation,
    words,
    distractors,
    selectedWords,
    onSelectionChange,
    questionNumber
}) {
    const [availableWords, setAvailableWords] = useState([]);
    const [arranged, setArranged] = useState([]);

    useEffect(() => {
        // Combine words and distractors, then shuffle
        const allWords = [...words, ...distractors];
        const shuffled = allWords.sort(() => Math.random() - 0.5);
        setAvailableWords(shuffled);
        setArranged([]);
    }, [words, distractors]);

    useEffect(() => {
        // Update parent with arranged words
        onSelectionChange(arranged.join(' '));
    }, [arranged, onSelectionChange]);

    const handleWordClick = (word) => {
        setArranged([...arranged, word]);
        setAvailableWords(availableWords.filter(w => w !== word));
    };

    const handleRemoveWord = (word, index) => {
        setArranged(arranged.filter((_, i) => i !== index));
        setAvailableWords([...availableWords, word]);
    };

    const handleClear = () => {
        setAvailableWords([...words, ...distractors].sort(() => Math.random() - 0.5));
        setArranged([]);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-border/50 shadow-2xl"
        >
            <div className="mb-6">
                <span className="text-secondary font-semibold text-sm">
                    Question {questionNumber}
                </span>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Arrange the words for <span className="text-secondary">{abbreviation}</span>
                </h2>
                <p className="text-muted-foreground text-sm">
                    Select words in the correct order. Some words are distractors.
                </p>
            </div>

            {/* Arranged words area */}
            <div className="mb-6 min-h-[100px] p-4 bg-card/50 rounded-xl border-2 border-dashed border-border">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground uppercase">Your Answer</span>
                    {arranged.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            className="text-xs text-red-400 hover:text-red-300"
                        >
                            Clear All
                        </Button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                        {arranged.length === 0 ? (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-muted-foreground text-sm italic"
                            >
                                Select words from below...
                            </motion.p>
                        ) : (
                            arranged.map((word, index) => (
                                <motion.div
                                    key={`${word}-${index}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg font-medium"
                                >
                                    <span>{word}</span>
                                    <button
                                        onClick={() => handleRemoveWord(word, index)}
                                        className="hover:bg-violet-700 rounded-full p-0.5"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Available words */}
            <div className="space-y-3">
                <span className="text-xs text-muted-foreground uppercase">Available Words</span>
                <div className="flex flex-wrap gap-3">
                    <AnimatePresence>
                        {availableWords.map((word, index) => (
                            <motion.button
                                key={`${word}-available-${index}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleWordClick(word)}
                                className="bg-card hover:bg-accent text-foreground px-4 py-2 rounded-lg font-medium border border-border transition-colors"
                            >
                                {word}
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}