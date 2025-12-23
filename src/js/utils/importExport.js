import database from '../database/database.js';
import { getProjectById, addProject } from '../database/projects.js';
import { getAllCategories, addCategory } from '../database/categories.js';
import { getAllTasks, addTask } from '../database/tasks.js';

/**
 * Exports a project as a JSON file.
 * @param {number} projectId - The ID of the project to export.
 */
export async function exportProject(projectId) {
    try {
        const project = await getProjectById(projectId);
        if (!project) {
            console.error('Project not found.');
            return;
        }

        const categories = await getAllCategories();
        const allTasks = await getAllTasks();

        const tasks = allTasks.filter(task => task.projectId === projectId);

        const projectData = {
            project,
            categories,
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
 * Imports a project from a JSON file.
 * @param {File} file - The JSON file to import.
 */
export async function importProject(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const projectData = JSON.parse(event.target.result);
                const { project, categories, tasks } = projectData;

                // Clear existing data
                // Clear existing data
                await database.clear('projects');
                await database.clear('categories');
                await database.clear('tasks');

                // Don't import project id
                const { id, ...newProject } = project;

                const newProjectId = await addProject(newProject);

                for (const category of categories) {
                    // Don't import category id
                    const { id, ...newCategory } = category;
                    await addCategory(newCategory);
                }

                for (const task of tasks) {
                    // Don't import task id
                    const { id, ...newTask } = task;
                    newTask.projectId = newProjectId;
                    await addTask(newTask);
                }

                resolve();
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
