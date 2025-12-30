import database from './database.js';
import { VOID_CATEGORY } from '../utils/constants.js';


async function addCategory(category) {
    return await database.add('categories', category);
}


async function getAllCategories() {
    return await database.getAll('categories');
}


async function getCategoryById(id) {
    return await database.get('categories', id);
}


async function deleteCategory(id) {
    return await database.delete('categories', id);
}


async function updateCategory(category) {
    return await database.put('categories', category);
}


/**
 * Creates the default Void category for a project.
 * This category is immutable and always has importance 0.
 * @param {number} projectId - The project ID to create the Void category for.
 * @param {string} projectType - Either 'numeric' or 'non-numeric'.
 * @returns {Promise<number>} The ID of the created category.
 */
async function addDefaultCategories(projectId, projectType = 'non-numeric') {
    const voidCategory = {
        ...VOID_CATEGORY,
        task: projectId,
    };

    if (projectType === 'numeric') {
        const { addNumericCategory } = await import('./categories_numeric.js');
        return await addNumericCategory(voidCategory);
    } else {
        return await addCategory(voidCategory);
    }
}

/**
 * Ensures a Void category exists for a project, creating it if not present.
 * Prevents duplicates by checking for existing Void category.
 * @param {number} projectId - The project ID.
 * @param {string} projectType - Either 'numeric' or 'non-numeric'.
 * @returns {Promise<number>} The ID of the existing or newly created Void category.
 */
async function ensureVoidCategory(projectId, projectType = 'non-numeric') {
    let categories;

    if (projectType === 'numeric') {
        const { getAllNumericCategories } = await import('./categories_numeric.js');
        categories = await getAllNumericCategories();
    } else {
        categories = await getAllCategories();
    }

    // Check if Void category already exists for this project
    const existingVoid = categories.find(cat => cat.task === projectId && cat.name === VOID_CATEGORY.name);

    if (existingVoid) {
        return existingVoid.id;
    }

    // Create the Void category if it doesn't exist
    return await addDefaultCategories(projectId, projectType);
}

export {
    addCategory,
    getAllCategories,
    getCategoryById,
    deleteCategory,
    addDefaultCategories,
    updateCategory,
    ensureVoidCategory
};
