import { addCategory, getAllCategories, deleteCategory, updateCategory } from '../database/categories.js';
import { addNumericCategory, getAllNumericCategories, deleteNumericCategory, updateNumericCategory } from '../database/categories_numeric.js';
import { i18n } from '../i18n/i18n.js';

class CategoryManager {
    constructor(projectId, projectType) {
        this.modal = document.getElementById('categoryModal');
        this.form = document.getElementById('categoryForm');
        this.closeBtn = this.modal.querySelector('.close[data-modal="category"]');
        this.categoryList = document.getElementById('categoryList');
        this.projectId = projectId;
        this.projectType = projectType;
        this.editingCategory = null;

        // Generate 32 distinct colors (HSL gradient: Hue 0-360, Sat 100%, Light 50%)
        this.colors = Array.from({ length: 32 }, (_, i) => {
            const hue = i * (360 / 32);
            return `hsl(${hue}, 100%, 50%)`;
        });

        this.initEventListeners();
        this.renderColorPicker();
    }

    initEventListeners() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Slider listener
        const slider = document.getElementById('categoryImportance');
        const output = document.getElementById('importanceValue');
        slider.addEventListener('input', (e) => {
            output.textContent = e.target.value;
        });
    }

    renderColorPicker() {
        const grid = document.getElementById('colorPickerGrid');

        grid.innerHTML = this.colors.map(color => {
            return `
            <div class="color-option" 
                 style="background-color: ${color}" 
                 data-color="${color}"
                 title="${color}">
            </div>
            `;
        }).join('');

        // Select first color by default
        this.selectColor(this.colors[0]);

        grid.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectColor(e.target.dataset.color);
            });
        });
    }

    selectColor(color) {
        const hiddenInput = document.getElementById('categoryColor');
        hiddenInput.value = color;

        document.querySelectorAll('.color-option').forEach(opt => {
            if (opt.dataset.color === color) {
                opt.classList.add('selected');
            } else {
                opt.classList.remove('selected');
            }
        });
    }

    setProject(projectId, projectType) {
        this.projectId = projectId;
        this.projectType = projectType;
    }

    async open() {
        if (!this.projectId) {
            alert(i18n.getText('alert.select_project'));
            return;
        }
        await this.loadCategories();
        this.modal.classList.add('active');
    }

    close() {
        this.modal.classList.remove('active');
        this.form.reset();
        this.selectColor(this.colors[0]); // Reset color
        document.getElementById('importanceValue').textContent = '5'; // Reset slider
        this.editingCategory = null;
        this.updateFormState();
        window.dispatchEvent(new CustomEvent('categoriesUpdated'));
    }

    updateFormState() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const header = this.modal.querySelector('h3');

        if (this.editingCategory) {
            submitBtn.textContent = 'Update Category';
            header.textContent = 'Edit Category';
        } else {
            submitBtn.textContent = 'Add Category';
            header.textContent = 'Add New Category';
        }
    }

    async loadCategories() {
        let categories = [];

        if (this.projectType === 'numeric') {
            const allCategories = await getAllNumericCategories();
            categories = allCategories.filter(cat => cat.task === this.projectId);
        } else {
            const allCategories = await getAllCategories();
            categories = allCategories.filter(cat => cat.task === this.projectId);
        }

        if (categories.length === 0) {
            this.categoryList.innerHTML = `<p class="empty-categories" data-i18n="modal.category.empty">${i18n.getText('modal.category.empty')}</p>`;
            return;
        }

        this.categoryList.innerHTML = categories.map(cat => `
            <div class="category-item">
                <div class="category-info">
                    <div class="category-color-preview" style="background-color: ${cat.color || '#4A90E2'}"></div>
                    <div class="category-details">
                        <div class="category-name">${cat.name}</div>
                        <div class="category-importance">
                            Importance: ${cat.importance}
                        </div>
                    </div>
                </div>
                <div class="category-actions">
                    <button class="category-edit" data-id="${cat.id}">✏️</button>
                    <button class="category-delete" data-id="${cat.id}">🗑️</button>
                </div>
            </div>
        `).join('');

        // Add delete event listeners
        this.categoryList.querySelectorAll('.category-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = parseInt(e.target.dataset.id);
                if (confirm(i18n.getText('modal.category.delete_confirm'))) {
                    if (this.projectType === 'numeric') {
                        await deleteNumericCategory(id);
                    } else {
                        await deleteCategory(id);
                    }
                    await this.loadCategories();
                }
            });
        });

        // Add edit event listeners
        this.categoryList.querySelectorAll('.category-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const category = categories.find(c => c.id === id);
                if (category) {
                    this.editCategory(category);
                }
            });
        });
    }

    editCategory(category) {
        this.editingCategory = category;

        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryImportance').value = category.importance;
        document.getElementById('importanceValue').textContent = category.importance;
        this.selectColor(category.color);

        this.updateFormState();
    }

    async handleSubmit(e) {
        e.preventDefault();

        const categoryData = {
            name: document.getElementById('categoryName').value,
            importance: parseInt(document.getElementById('categoryImportance').value),
            task: this.projectId,
            color: document.getElementById('categoryColor').value,
            completion: '0%'
        };

        try {
            if (this.editingCategory) {
                categoryData.id = this.editingCategory.id;
                if (this.projectType === 'numeric') {
                    await updateNumericCategory(categoryData);
                } else {
                    await updateCategory(categoryData);
                }
            } else {
                if (this.projectType === 'numeric') {
                    await addNumericCategory(categoryData);
                } else {
                    await addCategory(categoryData);
                }
            }

            this.form.reset();
            this.selectColor(this.colors[0]);
            document.getElementById('importanceValue').textContent = '5';
            this.editingCategory = null;
            this.updateFormState();
            await this.loadCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert(i18n.getText('alert.save_category_error'));
        }
    }
}

export default CategoryManager;