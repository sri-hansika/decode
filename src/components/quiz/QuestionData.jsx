// Dynamic Question Loader
// Fetches questions from /questions.json

let cachedQuestions = null;

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const fetchRandomQuestionsForLevel = async (level) => {
    // 1. Fetch if not cached
    if (!cachedQuestions) {
        try {
            // Timestamp to prevent caching issues if file changes
            const response = await fetch('/questions.json?t=' + Date.now());
            if (!response.ok) {
                throw new Error(`Failed to load questions: ${response.statusText}`);
            }
            cachedQuestions = await response.json();
        } catch (error) {
            console.error("Critical Error: Could not load question bank.", error);
            throw error;
        }
    }

    // 2. Determine difficulty key
    const levelMap = { 1: 'easy', 2: 'medium', 3: 'hard' };
    const difficulty = levelMap[level];

    if (!difficulty || !cachedQuestions[difficulty]) {
        console.error(`Invalid level or missing category for level ${level}`);
        throw new Error(`Invalid configuration for level ${level}`);
    }

    const pool = cachedQuestions[difficulty];
    const requiredCount = level === 1 ? 10 : level === 2 ? 20 : 30;

    // 3. Error Handling: Insufficient questions
    if (pool.length < requiredCount) {
        const msg = `Insufficient questions for ${difficulty} level. Required: ${requiredCount}, Available: ${pool.length}`;
        console.warn(`[ADMIN WARNING] ${msg}`);
        throw new Error(msg);
    }

    // 4. Randomize
    // "Read ONLY the [Level] questions ... Randomly select N questions"
    const shuffled = shuffleArray(pool);
    const selectedQuestions = shuffled.slice(0, requiredCount);

    // 5. Shuffle options for Hard level considerations (Multiple Choice)
    // to ensure answer is not always at index 0
    if (level === 3) {
        return selectedQuestions.map(q => {
            if (q.options && typeof q.answer === 'number') {
                const correctAnswerText = q.options[q.answer];
                const shuffledOptions = shuffleArray(q.options);
                const newAnswerIndex = shuffledOptions.indexOf(correctAnswerText);
                return {
                    ...q,
                    options: shuffledOptions,
                    answer: newAnswerIndex
                };
            }
            return q;
        });
    }

    // 6. Return subset
    return selectedQuestions;
};