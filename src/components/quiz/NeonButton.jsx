import React from 'react';
import { motion } from 'framer-motion';

export default function NeonButton({ children, onClick, disabled, variant = 'cyan', className = '' }) {
    const variants = {
        cyan: 'from-cyan-500 to-cyan-400 shadow-cyan-500/30 hover:shadow-cyan-500/50',
        violet: 'from-violet-500 to-purple-400 shadow-violet-500/30 hover:shadow-violet-500/50',
        pink: 'from-pink-500 to-rose-400 shadow-pink-500/30 hover:shadow-pink-500/50'
    };

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={`
        relative px-8 py-4 rounded-xl font-semibold text-white
        bg-gradient-to-r ${variants[variant]}
        shadow-lg transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
        >
            <span className="relative z-10">{children}</span>
            <motion.div
                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${variants[variant]} opacity-0`}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            />
        </motion.button>
    );
}