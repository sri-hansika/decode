import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ current, total, level }) {
    const percentage = (current / total) * 100;

    const levelColors = {
        1: 'from-cyan-500 to-cyan-400',
        2: 'from-violet-500 to-purple-400',
        3: 'from-pink-500 to-rose-400'
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">
                    Question {current} of {total}
                </span>
                <span className="text-sm font-medium text-cyan-400">
                    Level {level}
                </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full bg-gradient-to-r ${levelColors[level]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                />
            </div>
            <div className="flex justify-between mt-2">
                {Array.from({ length: total }, (_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i < current ? 'bg-cyan-400' : 'bg-gray-700'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}