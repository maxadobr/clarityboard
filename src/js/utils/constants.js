
const ERROR_MESSAGES = {
    EMPTY_PROJECT_NAME: "Project name cannot be empty.",
    INVALID_CATEGORY: "Category must be either numeric or textual.",
    TASK_ADDED: "Task has been successfully added.",
    PROJECT_ADDED: "Project has been successfully added.",
};

const CATEGORY_TYPES = {
    TEXTUAL: "textual",
    NUMERIC: "numeric",
};

// Void category is a special fixed category present in every project
// It serves as a placeholder with zero importance for frictionless task creation
const VOID_CATEGORY = {
    name: 'Void',
    importance: 0,
    color: 'var(--text-primary)', // Adapts to theme: black in light mode, white in dark mode
    completion: '0%'
};

// Helper function to check if a category is the Void category
function isVoidCategory(category) {
    return category && category.name === VOID_CATEGORY.name;
}

const DB_VERSION = 1;
const DB_NAME = "ClarityBoard";

export { ERROR_MESSAGES, CATEGORY_TYPES, DB_VERSION, DB_NAME, VOID_CATEGORY, isVoidCategory };

