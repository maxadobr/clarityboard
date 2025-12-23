import { getAllCategories, updateCategory } from './categories.js';
import { getAllNumericCategories, updateNumericCategory } from './categories_numeric.js';

export async function runMigrations() {
    console.log('Running migrations...');
    await migrateImportance();
    console.log('Migrations completed.');
}

async function migrateImportance() {
    try {
        // 1. Migrate standard categories
        const categories = await getAllCategories();
        for (const cat of categories) {
            if (cat.importance > 10) {
                console.log(`Migrating category "${cat.name}" importance from ${cat.importance} to 10`);
                cat.importance = 10;
                await updateCategory(cat);
            }
        }

        // 2. Migrate numeric categories
        const numericCategories = await getAllNumericCategories();
        for (const cat of numericCategories) {
            if (cat.importance > 10) {
                console.log(`Migrating numeric category "${cat.name}" importance from ${cat.importance} to 10`);
                cat.importance = 10;
                await updateNumericCategory(cat);
            }
        }
    } catch (error) {
        console.error('Error running importance migration:', error);
    }
}
