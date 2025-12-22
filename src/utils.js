export const createPageUrl = (pageName) => {
    switch (pageName) {
        case 'Home': return '/';
        case 'Login': return '/login'; // Assuming login page
        case 'Admin': return '/admin';
        case 'UserLogins': return '/admin/logins';
        case 'Quiz': return '/quiz';
        case 'Summary': return '/quiz/summary';
        case 'Results': return '/quiz/results';
        case 'DetailedResults': return '/quiz/results/detailed';
        case 'Instructions': return '/instructions';
        // Add other mappings as needed
        default: return `/${pageName.toLowerCase()}`;
    }
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
};
