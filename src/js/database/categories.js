import database from './database.js';


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

function addDefaultCategories() {
    const defaultCategories = [
        { name: 'Health', importance: 2, color: '#28a745' },
        { name: 'Entertainment', importance: 1, color: '#ffc107' },
        { name: 'Work', importance: 3, color: '#dc3545' },
        { name: 'Home', importance: 2, color: '#007bff' }
    ];

    return Promise.all(defaultCategories.map(cat => addCategory(cat)));
}

export { addCategory, getAllCategories, getCategoryById, deleteCategory, addDefaultCategories, updateCategory };
