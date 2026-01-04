import React from 'react';
import { motion } from 'framer-motion';

export default function Layout({ children, currentPageName }) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Fixed Header - Hidden on Home page */}
            {currentPageName !== 'Home' && (
                <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 sm:h-20">
                            {/* Left side - Logo + EPROZYNE */}
                            <div className="flex items-center gap-2 sm:gap-3">
                                {/* Pragati Engineering College Logo */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex-shrink-0"
                                >
                                    <img
                                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69416e1ee8d0c6d9a3f888ac/115ec7254_image.png"
                                        alt="Pragati Engineering College"
                                        className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                                    />
                                </motion.div>

                                {/* EPROZYNE text */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                >
                                    <h1 className="text-base sm:text-xl md:text-2xl font-black bg-gradient-to-r from-secondary via-accent to-accent bg-clip-text text-transparent tracking-tight">
                                        EPROZYNE
                                    </h1>
                                </motion.div>
                            </div>

                            {/* Right side - DECODE DESK */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="relative"
                            >
                                <h1 className="text-base sm:text-xl md:text-2xl font-black bg-gradient-to-r from-primary via-destructive to-primary bg-clip-text text-transparent tracking-tight whitespace-nowrap">
                                    DECODE DESK
                                </h1>
                                <motion.div
                                    className="absolute -inset-2 bg-primary/10 rounded blur-lg -z-10"
                                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                />
                            </motion.div>
                        </div>
                    </div>
                </header>
            )}

            {/* Main content with padding to account for fixed header */}
            <main className={`flex-1 ${currentPageName !== 'Home' ? 'pt-16 sm:pt-20' : ''}`}>
                {children}
            </main>

            {/* Static Footer - appears at bottom of content naturally */}
            <footer className="bg-background border-t border-border/50 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-4 sm:py-6">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-muted-foreground text-xs sm:text-sm text-center leading-relaxed"
                        >
                            Developed by{' '}
                            <span className="text-primary font-semibold">Sri Hansika Vanum</span>
                            {' '}<span className="text-muted-foreground">|</span>{' '}
                            <span className="text-secondary">CSE Department</span>
                            {' '}<span className="text-muted-foreground">|</span>{' '}
                            <span className="text-accent">Strides 2k26</span>
                        </motion.p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
        @media (max-width: 640px) {
          /* Ensure text doesn't overflow on very small screens */
          h1 {
            letter-spacing: -0.025em;
          }
        }
      `}</style>
        </div>
    );
}