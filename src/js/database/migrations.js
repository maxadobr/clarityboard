import database from './database.js';
import { addCategory, getAllCategories, updateCategory } from './categories.js';
import { addNumericCategory, getAllNumericCategories, updateNumericCategory } from './categories_numeric.js';
import { getAllProjects } from './projects.js';

// Add default Blank category to all existing projects
async function addBlankCategoryToExistingProjects() {
    try {
        const projects = await getAllProjects();
        const allCategories = await getAllCategories();
        const allNumericCategories = await getAllNumericCategories();

        for (const project of projects) {
            const blankCategory = {
                name: 'Void', // Constant name in database
                importance: 0,
                task: project.id,
                color: '#6c757d',
                completion: '0%'
            };

            if (project.type === 'numeric') {
                // Check if blank category already exists
                const existingBlank = allNumericCategories.find(
                    cat => cat.task === project.id && cat.name === 'Void'
                );
                if (!existingBlank) {
                    await addNumericCategory(blankCategory);
                    console.log(`Added Void category to numeric project: ${project.name}`);
                }
            } else {
                // Check if blank category already exists
                const existingBlank = allCategories.find(
                    cat => cat.task === project.id && cat.name === 'Void'
                );
                if (!existingBlank) {
                    await addCategory(blankCategory);
                    console.log(`Added Void category to project: ${project.name}`);
                }
            }
        }

        console.log('Migration completed: Default Blank categories added to all projects');
        return true;
    } catch (error) {
        console.error('Error during migration:', error);
        throw error;
    }
}

export async function runMigrations() {
    console.log('Running migrations...');
    await addBlankCategoryToExistingProjects();
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
