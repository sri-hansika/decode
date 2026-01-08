import { useState, useEffect, useCallback, useRef } from 'react';

export default function useTabSwitchListener(studentId, maxWarnings = 3, onDisqualify) {
    const [warningCount, setWarningCount] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const hasDisqualified = useRef(false);

    // Load initial count
    useEffect(() => {
        if (!studentId) return;
        const storedCount = parseInt(localStorage.getItem(`tab_switch_count_${studentId}`) || '0', 10);
        setWarningCount(storedCount);

        if (storedCount > maxWarnings) {
            // Already disqualified
            if (!hasDisqualified.current) {
                hasDisqualified.current = true;
                onDisqualify();
            }
        }
    }, [studentId, maxWarnings, onDisqualify]);

    const handleViolation = useCallback(() => {
        if (hasDisqualified.current) return;

        setWarningCount(prev => {
            const newCount = prev + 1;
            localStorage.setItem(`tab_switch_count_${studentId}`, newCount.toString());

            if (newCount > maxWarnings) {
                hasDisqualified.current = true;
                onDisqualify();
            } else {
                setShowWarning(true);
            }
            return newCount;
        });
    }, [studentId, maxWarnings, onDisqualify]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                handleViolation();
            }
        };

        const handleBlur = () => {
            handleViolation();
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
        };
    }, [handleViolation]);

    return {
        warningCount,
        showWarning,
        setShowWarning
    };
}
