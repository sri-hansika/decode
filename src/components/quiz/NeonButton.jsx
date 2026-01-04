import React from 'react';
import { motion } from 'framer-motion';

export default function NeonButton({ children, onClick, disabled, variant = 'cyan', className = '' }) {
    const variants = {
        cyan: 'from-primary to-accent shadow-primary/30 hover:shadow-primary/50 text-primary-foreground',
        violet: 'from-secondary to-accent shadow-secondary/30 hover:shadow-secondary/50 text-secondary-foreground',
        pink: 'from-accent to-destructive shadow-accent/30 hover:shadow-accent/50 text-accent-foreground'
    };

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={`
        relative px-8 py-4 rounded-xl font-semibold text-foreground
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