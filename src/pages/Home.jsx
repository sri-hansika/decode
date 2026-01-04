import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Sparkles, Code, Brain } from 'lucide-react';
import NeonButton from '@/components/quiz/NeonButton';

export default function Home() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 overflow-hidden relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center max-w-3xl mx-auto"
            >
                {/* College Name */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-6"
                >
                    <h2 className="text-lg md:text-xl text-muted-foreground font-medium tracking-widest uppercase">
                        Pragati Engineering College
                    </h2>
                </motion.div>

                {/* Event Name - Eprozyne */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mb-4"
                >
                    <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                        EPROZYNE
                    </h1>
                </motion.div>

                {/* Decodedesk */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="relative inline-block">
                        <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-destructive to-accent tracking-tight">
                            DECODEDESK
                        </h1>
                        <motion.div
                            className="absolute -inset-4 bg-primary/20 rounded-lg blur-2xl -z-10"
                            animate={{ opacity: [0.5, 0.8, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />
                    </div>
                </motion.div>

                {/* Department */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mb-12"
                >
                    <p className="text-muted-foreground text-lg tracking-wide">
                        Organized by{' '}
                        <span className="text-primary font-semibold">
                            Department of CSE
                        </span>
                    </p>
                </motion.div>

                {/* Feature icons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="flex justify-center gap-8 mb-12"
                >
                    {[
                        { icon: Code, label: 'Coding' },
                        { icon: Brain, label: 'Logic' },
                        { icon: Sparkles, label: 'Innovation' }
                    ].map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center">
                                <item.icon className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-xs text-muted-foreground">{item.label}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Start Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                >
                    <Link to={createPageUrl('Verify')}>
                        <NeonButton variant="cyan" className="text-lg px-12">
                            Start Quiz
                        </NeonButton>
                    </Link>
                </motion.div>

                {/* Info text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                    className="mt-8 text-muted-foreground text-sm"
                >
                    3 Levels • 60 Questions • Test Your Knowledge
                </motion.p>
            </motion.div>
        </div>
    );
}