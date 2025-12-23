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



async function addDefaultCategories(projectId, projectType = 'non-numeric') {
    const blankCategory = {
        name: 'Void', // Constant name in database, translated in UI layer
        importance: 0,
        task: projectId,
        color: '#6c757d', // Neutral gray
        completion: '0%'
    };

    if (projectType === 'numeric') {
        const { addNumericCategory } = await import('./categories_numeric.js');
        return await addNumericCategory(blankCategory);
    } else {
        return await addCategory(blankCategory);
    }
}

export { addCategory, getAllCategories, getCategoryById, deleteCategory, addDefaultCategories, updateCategory };
