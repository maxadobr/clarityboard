import { i18n } from '../i18n/i18n.js';

/**
 * Translates special category names from database constants to localized strings
 * @param {string} categoryName - The category name from database
 * @returns {string} - The translated category name for display
 */
export function translateCategoryName(categoryName) {
    if (categoryName === 'Void') {
        return i18n.getText('category.default_blank');
    }
    return categoryName;
}

/**
 * Gets the database constant name for a special category
 * @param {string} displayName - The translated display name
 * @returns {string} - The database constant name
 */
export function getCategoryDatabaseName(displayName) {
    const blankName = i18n.getText('category.default_blank');
    if (displayName === blankName || displayName === 'Void') {
        return 'Void';
    }
    return displayName;
}
