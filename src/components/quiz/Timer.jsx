import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Timer({ duration, onTimeUp, isActive }) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

    useEffect(() => {
        if (!isActive) return;

        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isActive, onTimeUp]);

    const percentage = (timeLeft / duration) * 100;
    const isLow = timeLeft <= 10;
    const isCritical = timeLeft <= 5;

    return (
        <div className="relative">
            <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="#1F1F1F"
                            strokeWidth="6"
                            fill="none"
                        />
                        <motion.circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke={isCritical ? '#EF4444' : isLow ? '#F59E0B' : '#00F0FF'}
                            strokeWidth="6"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={226}
                            strokeDashoffset={226 - (226 * percentage) / 100}
                            initial={false}
                            animate={{
                                strokeDashoffset: 226 - (226 * percentage) / 100,
                            }}
                            transition={{ duration: 0.5 }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.span
                            className={`text-2xl font-bold ${isCritical ? 'text-red-500' : isLow ? 'text-amber-500' : 'text-cyan-400'
                                }`}
                            animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                        >
                            {timeLeft}
                        </motion.span>
                    </div>
                </div>
                <div className="text-sm text-gray-400">
                    <p>seconds</p>
                    <p>remaining</p>
                </div>
            </div>
        </div>
    );
}