import database from './database.js';


async function addTask(task) {
    return await database.add('tasks', task);
}


async function getAllTasks() {
    return await database.getAll('tasks');
}


async function updateTask(task) {
    return await database.put('tasks', task);
}


async function deleteTask(id) {
    return await database.delete('tasks', id);
}

export { addTask, getAllTasks, updateTask, deleteTask };
