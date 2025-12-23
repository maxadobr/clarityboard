import { addDefaultCategories } from './categories.js';



const DB_NAME = 'ClarityBoardDB';
const DB_VERSION = 3;

let db = null;


function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const transaction = event.target.transaction;

            
            if (!db.objectStoreNames.contains('projects')) {
                const projectStore = db.createObjectStore('projects', { keyPath: 'id', autoIncrement: true });
                projectStore.createIndex('name', 'name', { unique: false });
                projectStore.createIndex('type', 'type', { unique: false });
            }

            
            let categoryStore;
            if (!db.objectStoreNames.contains('categories')) {
                categoryStore = db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
                categoryStore.createIndex('task', 'task', { unique: false });
                categoryStore.createIndex('name', 'name', { unique: false });
            } else {
                categoryStore = transaction.objectStore('categories');
            }
            if (!categoryStore.indexNames.contains('projectId')) {
                categoryStore.createIndex('projectId', 'projectId', { unique: false });
            }

            
            let numericStore;
            if (!db.objectStoreNames.contains('categories_numeric')) {
                numericStore = db.createObjectStore('categories_numeric', { keyPath: 'id', autoIncrement: true });
                numericStore.createIndex('task', 'task', { unique: false });
                numericStore.createIndex('name', 'name', { unique: false });
            } else {
                numericStore = transaction.objectStore('categories_numeric');
            }
            if (!numericStore.indexNames.contains('projectId')) {
                numericStore.createIndex('projectId', 'projectId', { unique: false });
            }

            
            if (!db.objectStoreNames.contains('tasks')) {
                const taskStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
                taskStore.createIndex('projectId', 'projectId', { unique: false });
                taskStore.createIndex('status', 'status', { unique: false });
                taskStore.createIndex('FK_categories_id', 'FK_categories_id', { unique: false });
                taskStore.createIndex('FK_categories_numeric_id', 'FK_categories_numeric_id', { unique: false });
            }
        };
    });
}

function getDB() {
    return db;
}

export { initDB, getDB };
