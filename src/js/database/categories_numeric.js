import database from './database.js';


async function addNumericCategory(category) {
    return await database.add('categories_numeric', category);
}


async function getAllNumericCategories() {
    return await database.getAll('categories_numeric');
}


async function getNumericCategoryById(id) {
    return await database.get('categories_numeric', id);
}


async function deleteNumericCategory(id) {
    return await database.delete('categories_numeric', id);
}


async function updateNumericCategory(category) {
    return await database.put('categories_numeric', category);
}

export { addNumericCategory, getAllNumericCategories, getNumericCategoryById, deleteNumericCategory, updateNumericCategory };
