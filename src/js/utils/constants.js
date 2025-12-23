
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

const DB_VERSION = 1; 
const DB_NAME = "ClarityBoard"; 

export { ERROR_MESSAGES, CATEGORY_TYPES, DB_VERSION, DB_NAME };
