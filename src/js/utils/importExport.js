import database from '../database/database.js';
import { getProjectById, addProject, getAllProjects } from '../database/projects.js';
import { getAllCategories, addCategory, ensureVoidCategory } from '../database/categories.js';
import { getAllNumericCategories, addNumericCategory } from '../database/categories_numeric.js';
import { getAllTasks, addTask } from '../database/tasks.js';
import { VOID_CATEGORY, isVoidCategory } from '../utils/constants.js';

/**
 * Exports a project as a JSON file.
 * Includes the project, its categories (regular and numeric), and its tasks.
 * Categories are associated with projects via the 'task' field.
 * @param {number} projectId - The ID of the project to export.
 */
export async function exportProject(projectId) {
    try {
        const project = await getProjectById(projectId);
        if (!project) {
            console.error('Project not found.');
            return;
        }

        // Get only categories belonging to this project (categories use 'task' field for projectId)
        const allCategories = await getAllCategories();
        const categories = allCategories.filter(cat => cat.task === projectId);

        // Get only numeric categories belonging to this project
        const allNumericCategories = await getAllNumericCategories();
        const numericCategories = allNumericCategories.filter(cat => cat.task === projectId);

        // Get only tasks belonging to this project
        const allTasks = await getAllTasks();
        const tasks = allTasks.filter(task => task.projectId === projectId);

        const projectData = {
            project,
            categories,
            numericCategories,
            tasks,
        };

        const json = JSON.stringify(projectData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.name.replace(/\s+/g, '_')}_export.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting project:', error);
    }
}

/**
 * Imports a project from a JSON file, including categories and tasks.
 * Prevents duplicates by name and ensures the Void category exists.
 * @param {File} file - The JSON file to import.
 * @returns {Promise<{success: boolean, message: string, projectId?: number}>}
 */
export async function importProject(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const projectData = JSON.parse(event.target.result);
                const { project, categories = [], numericCategories = [], tasks = [] } = projectData;

                // Check for duplicate project by name
                const existingProjects = await getAllProjects();
                const duplicateProject = existingProjects.find(
                    p => p.name.toLowerCase().trim() === project.name.toLowerCase().trim()
                );

                if (duplicateProject) {
                    reject(new Error(`A project with the name "${project.name}" already exists.`));
                    return;
                }

                // Create ID mappings to update references
                const categoryIdMap = new Map();
                const numericCategoryIdMap = new Map();

                // Add the project (without original id)
                const { id: originalProjectId, ...newProject } = project;
                const newProjectId = await addProject(newProject);

                // Determine project type
                const projectType = project.type || 'non-numeric';

                // Track if Void category was imported
                let voidCategoryImported = false;

                // Import regular categories and map old IDs to new IDs
                // Categories use 'task' field to store projectId
                // Skip duplicate Void categories - only import one
                for (const category of categories) {
                    const { id: originalCategoryId, ...newCategory } = category;

                    // Check if this is a Void category
                    if (isVoidCategory(category)) {
                        if (voidCategoryImported) {
                            // Skip duplicate Void category
                            continue;
                        }
                        // Use the standard Void category properties
                        newCategory.name = VOID_CATEGORY.name;
                        newCategory.importance = VOID_CATEGORY.importance;
                        newCategory.color = VOID_CATEGORY.color;
                        voidCategoryImported = true;
                    }

                    newCategory.task = newProjectId;
                    const newCategoryId = await addCategory(newCategory);
                    categoryIdMap.set(originalCategoryId, newCategoryId);
                }

                // Import numeric categories and map old IDs to new IDs
                let voidNumericCategoryImported = false;
                for (const numericCategory of numericCategories) {
                    const { id: originalNumCatId, ...newNumericCategory } = numericCategory;

                    // Check if this is a Void category
                    if (isVoidCategory(numericCategory)) {
                        if (voidNumericCategoryImported) {
                            // Skip duplicate Void category
                            continue;
                        }
                        // Use the standard Void category properties
                        newNumericCategory.name = VOID_CATEGORY.name;
                        newNumericCategory.importance = VOID_CATEGORY.importance;
                        newNumericCategory.color = VOID_CATEGORY.color;
                        voidNumericCategoryImported = true;
                    }

                    newNumericCategory.task = newProjectId;
                    const newNumCatId = await addNumericCategory(newNumericCategory);
                    numericCategoryIdMap.set(originalNumCatId, newNumCatId);
                }

                // Ensure Void category exists if it wasn't in the import file
                if (projectType === 'numeric') {
                    if (!voidNumericCategoryImported) {
                        await ensureVoidCategory(newProjectId, 'numeric');
                    }
                } else {
                    if (!voidCategoryImported) {
                        await ensureVoidCategory(newProjectId, 'non-numeric');
                    }
                }

                // Import tasks with updated references
                for (const task of tasks) {
                    const { id: originalTaskId, ...newTask } = task;
                    newTask.projectId = newProjectId;

                    // Update category reference if it exists
                    if (newTask.FK_categories_id && categoryIdMap.has(newTask.FK_categories_id)) {
                        newTask.FK_categories_id = categoryIdMap.get(newTask.FK_categories_id);
                    }

                    // Update numeric category reference if it exists
                    if (newTask.FK_categories_numeric_id && numericCategoryIdMap.has(newTask.FK_categories_numeric_id)) {
                        newTask.FK_categories_numeric_id = numericCategoryIdMap.get(newTask.FK_categories_numeric_id);
                    }

                    await addTask(newTask);
                }

                resolve({ success: true, message: 'Project imported successfully', projectId: newProjectId });
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsText(file);
    });
}
