import database from './database.js';
import { getAllTasks, deleteTask } from './tasks.js';
import { getAllCategories, deleteCategory } from './categories.js';
import { getAllNumericCategories, deleteNumericCategory } from './categories_numeric.js';


async function addProject(project) {
    return await database.add('projects', project);
}


async function getAllProjects() {
    return await database.getAll('projects');
}


async function getProjectById(id) {
    return await database.get('projects', id);
}


async function deleteProject(id) {
    try {
        // 1. Delete associated Tasks
        const allTasks = await getAllTasks();
        const projectTasks = allTasks.filter(task => task.projectId === id);
        await Promise.all(projectTasks.map(task => deleteTask(task.id)));

        // 2. Delete associated Categories
        const allCategories = await getAllCategories();
        const projectCategories = allCategories.filter(cat => cat.projectId === id);
        await Promise.all(projectCategories.map(cat => deleteCategory(cat.id)));

        // 3. Delete associated Numeric Categories
        const allNumCategories = await getAllNumericCategories();
        const projectNumCategories = allNumCategories.filter(cat => cat.projectId === id);
        await Promise.all(projectNumCategories.map(cat => deleteNumericCategory(cat.id)));

        // 4. Delete the Project itself
        await database.delete('projects', id);
        return true;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
}


async function updateProject(project) {
    return await database.put('projects', project);
}

export { addProject, getAllProjects, getProjectById, deleteProject, updateProject };
