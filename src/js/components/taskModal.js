import { addTask, updateTask } from '../database/tasks.js';
import { getAllCategories, addCategory, deleteCategory } from '../database/categories.js';
import { getAllNumericCategories, addNumericCategory, deleteNumericCategory } from '../database/categories_numeric.js';
import { i18n } from '../i18n/i18n.js';

class TaskModal {
    constructor(currentProjectId, projectType, categoryManager) {
        this.modal = document.getElementById('taskModal');
        this.form = document.getElementById('taskForm');
        this.closeBtn = this.modal.querySelector('.close[data-modal="task"]');
        this.currentProjectId = currentProjectId;
        this.projectType = projectType;
        this.categoryManager = categoryManager;
        this.editingTask = null; // Track if we are editing

        this.initEventListeners();
    }

    initEventListeners() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        document.getElementById('manageCategoriesLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.categoryManager.open();
        });

        // Update categories when changes occur
        window.addEventListener('categoriesUpdated', () => {
            if (this.modal.classList.contains('active')) {
                this.loadCategories();
            }
        });

        // Listen for openTaskModal event
        window.addEventListener('openTaskModal', (e) => {
            if (e.detail && e.detail.task) {
                this.openForEdit(e.detail.task);
            } else {
                this.openForCreate(e.detail ? e.detail.status : null);
            }
        });

        const categoryInput = document.getElementById('taskCategoryInput');
        const dropdown = document.getElementById('categoryDropdown');

        const showDropdown = () => {
            // Filter based on current input
            const filterText = categoryInput.value.toLowerCase();
            this.renderDropdown(filterText);
            dropdown.classList.add('visible');
        };

        const hideDropdown = () => {
            setTimeout(() => {
                dropdown.classList.remove('visible');
            }, 200); // Delay to allow click event
        };

        categoryInput.addEventListener('focus', showDropdown);
        categoryInput.addEventListener('click', showDropdown); // Ensure opens on click even if focused
        categoryInput.addEventListener('blur', hideDropdown);

        categoryInput.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const name = categoryInput.value.trim();
                if (name) {
                    await this.handleCategoryCreation(name);
                    hideDropdown(); // Hide after creation
                }
            }
        });

        // Filter dropdown on input
        categoryInput.addEventListener('input', (e) => {
            dropdown.classList.add('visible'); // Ensure visible when typing/clearing
            const name = e.target.value.trim();
            this.renderDropdown(name.toLowerCase());

            // Check for exact match or empty
            if (!name) {
                document.getElementById('taskCategory').value = '';
                this.updateSelectedCategoryVisual(null);
                return;
            }

            // Still try to auto-map ID if exact match
            const category = this.currentCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
            if (category) {
                document.getElementById('taskCategory').value = category.id;
                this.updateSelectedCategoryVisual(category.color);
            } else {
                document.getElementById('taskCategory').value = '';
                this.updateSelectedCategoryVisual(null);
            }
        });

        // Confirmation button for category creation (mobile support)
        const confirmCategoryBtn = document.getElementById('confirmCategoryBtn');
        confirmCategoryBtn.addEventListener('click', async () => {
            const name = categoryInput.value.trim();
            if (name) {
                await this.handleCategoryCreation(name);
                hideDropdown();
            }
        });

        // Urgency Selector
        this.modal.querySelectorAll('.urgency-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const value = e.target.dataset.value;
                this.updateUrgencyVisual(value);
            });
        });
    }

    renderDropdown(filterText = '') {
        const dropdown = document.getElementById('categoryDropdown');
        dropdown.innerHTML = '';

        const filtered = this.currentCategories.filter(c => c.name.toLowerCase().includes(filterText));

        if (filtered.length === 0) {
            if (filterText) {
                dropdown.innerHTML = `<div class="dropdown-item" style="cursor: default; color: var(--text-tertiary);">${i18n.getText('common.no_matches')}</div>`;
            } else {
                dropdown.innerHTML = `<div class="dropdown-item" style="cursor: default; color: var(--text-tertiary);">${i18n.getText('common.start_typing')}</div>`;
            }
            this.updateSelectedCategoryVisual(null); // Clear dot if no match/typing new
            return;
        }

        filtered.forEach(cat => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';

            // Item content
            const content = document.createElement('span');
            content.style.display = 'flex';
            content.style.alignItems = 'center';
            content.style.gap = '8px';
            content.innerHTML = `<span class="color-dot" style="background-color: ${cat.color || '#ccc'}"></span> ${cat.name}`;
            item.appendChild(content);

            // Delete button
            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.title = 'Delete Category';

            // Delete logic
            deleteBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent selection

                if (confirm(i18n.getText('modal.category.delete_confirm'))) {
                    try {
                        if (this.projectType === 'numeric') {
                            await deleteNumericCategory(cat.id);
                        } else {
                            await deleteCategory(cat.id);
                        }

                        // Passa valores vazios para limpar se for o atual
                        if (document.getElementById('taskCategory').value == cat.id) {
                            document.getElementById('taskCategoryInput').value = '';
                            document.getElementById('taskCategory').value = '';
                            this.updateSelectedCategoryVisual(null);
                        }

                        await this.loadCategories();
                        this.renderDropdown(document.getElementById('taskCategoryInput').value.toLowerCase());
                    } catch (error) {
                        console.error('Error deleting category:', error);
                        alert(i18n.getText('modal.category.delete_error'));
                    }
                }
            });
            item.appendChild(deleteBtn);

            // Selection logic
            item.addEventListener('click', () => {
                document.getElementById('taskCategoryInput').value = cat.name;
                document.getElementById('taskCategory').value = cat.id;
                this.updateSelectedCategoryVisual(cat.color);
            });

            dropdown.appendChild(item);
        });
    }

    updateSelectedCategoryVisual(color) {
        const dot = document.getElementById('selectedCategoryDot');
        const input = document.getElementById('taskCategoryInput');
        if (color) {
            dot.style.display = 'block';
            dot.style.backgroundColor = color;
            input.style.paddingLeft = '32px';
        } else {
            dot.style.display = 'none';
            dot.style.backgroundColor = 'transparent';
            input.style.paddingLeft = '12px'; // Default padding
        }
    }

    updateUrgencyVisual(urgency) {
        const dots = this.modal.querySelectorAll('.urgency-dot');
        dots.forEach(dot => {
            if (dot.dataset.value === urgency) {
                dot.classList.add('selected');
            } else {
                dot.classList.remove('selected');
            }
        });
        document.getElementById('taskUrgency').value = urgency || 'low';
    }

    async handleCategoryCreation(name) {
        // Check if exists
        const exists = this.currentCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
        if (exists) {
            document.getElementById('taskCategory').value = exists.id;
            return;
        }

        // Create new
        const colors = Array.from({ length: 32 }, (_, i) => {
            const hue = i * (360 / 32);
            return `hsl(${hue}, 100%, 50%)`;
        });
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newCategory = {
            name: name,
            importance: 5,
            task: this.currentProjectId,
            color: randomColor,
            completion: '0%'
        };

        try {
            if (this.projectType === 'numeric') {
                await addNumericCategory(newCategory);
            } else {
                await addCategory(newCategory);
            }
            await this.loadCategories();

            // Select the new one
            const created = this.currentCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
            if (created) {
                document.getElementById('taskCategoryInput').value = created.name;
                document.getElementById('taskCategory').value = created.id;
                this.updateSelectedCategoryVisual(created.color);
            }
        } catch (error) {
            console.error("Error creating category:", error);
            alert(i18n.getText('alert.save_category_error'));
        }
    }

    async setProject(projectId, projectType) {
        this.currentProjectId = projectId;
        this.projectType = projectType;
        await this.loadCategories();
        this.updateFormBasedOnType();
    }

    async loadCategories() {
        const categoryInput = document.getElementById('taskCategoryInput');
        const categoryHidden = document.getElementById('taskCategory');

        let categories = [];

        if (this.projectType === 'numeric') {
            const allCategories = await getAllNumericCategories();
            categories = allCategories.filter(cat => cat.task === this.currentProjectId);
        } else {
            const allCategories = await getAllCategories();
            categories = allCategories.filter(cat => cat.task === this.currentProjectId);
        }

        this.currentCategories = categories; // Store for lookup
    }

    updateFormBasedOnType() {
        const numericGroup = document.getElementById('numericGroup');
        if (this.projectType === 'numeric') {
            numericGroup.classList.remove('hidden');
        } else {
            numericGroup.classList.add('hidden');
        }
    }

    async openForCreate(status) {
        if (!this.currentProjectId) {
            alert(i18n.getText('alert.select_project'));
            return;
        }
        this.editingTask = null;
        this.form.reset();

        if (status) {
            document.getElementById('taskStatus').value = status;
        }

        document.getElementById('taskDeadline').value = '';
        document.getElementById('taskSchedule').value = '';

        document.getElementById('modalTitle').textContent = i18n.getText('modal.task.create_title');
        document.getElementById('submitTaskBtn').textContent = i18n.getText('modal.task.create_btn');

        this.updateSelectedCategoryVisual(null); // Reset visual state
        this.updateUrgencyVisual('low'); // Default urgency

        await this.loadCategories();
        this.modal.classList.add('active');
    }

    async openForEdit(task) {
        this.editingTask = task;
        document.getElementById('modalTitle').textContent = i18n.getText('modal.task.edit_title');
        document.getElementById('submitTaskBtn').textContent = i18n.getText('modal.task.save_btn');

        await this.loadCategories();

        // Populate form
        document.getElementById('taskName').value = task.name;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskStatus').value = task.status;
        document.getElementById('taskDeadline').value = task.deadline || '';
        document.getElementById('taskSchedule').value = task.schedule || '';

        if (task.FK_categories_id) {
            document.getElementById('taskCategory').value = task.FK_categories_id;
            const category = this.currentCategories.find(c => c.id === task.FK_categories_id);
            if (category) {
                document.getElementById('taskCategoryInput').value = category.name;
                this.updateSelectedCategoryVisual(category.color);
            }
        } else if (task.FK_categories_numeric_id) {
            document.getElementById('taskCategory').value = task.FK_categories_numeric_id;
            const category = this.currentCategories.find(c => c.id === task.FK_categories_numeric_id);
            if (category) {
                document.getElementById('taskCategoryInput').value = category.name;
                this.updateSelectedCategoryVisual(category.color);
            }
        }

        if (this.projectType === 'numeric' && task.numeric) {
            document.getElementById('taskNumeric').value = task.numeric;
        }

        this.updateUrgencyVisual(task.urgency || 'low');

        this.modal.classList.add('active');
    }

    close() {
        this.modal.classList.remove('active');
        this.form.reset();
        this.editingTask = null;
        this.updateSelectedCategoryVisual(null);
        this.updateUrgencyVisual('low'); // Reset to default
    }

    async handleSubmit(e) {
        e.preventDefault();

        const categoryId = parseInt(document.getElementById('taskCategory').value);
        if (!categoryId) {
            alert(i18n.getText('alert.select_category'));
            return;
        }

        const taskData = {
            name: document.getElementById('taskName').value,
            description: document.getElementById('taskDescription').value,
            status: document.getElementById('taskStatus').value,
            deadline: document.getElementById('taskDeadline').value || null,
            schedule: document.getElementById('taskSchedule').value || null,
            urgency: document.getElementById('taskUrgency').value || 'low',
            projectId: this.currentProjectId,
            updated_at: new Date().toISOString()
        };

        if (this.projectType === 'numeric') {
            taskData.FK_categories_numeric_id = categoryId;
            taskData.numeric = parseFloat(document.getElementById('taskNumeric').value) || 0;
        } else {
            taskData.FK_categories_id = categoryId;
        }

        try {
            if (this.editingTask) {
                taskData.id = this.editingTask.id;
                taskData.created_at = this.editingTask.created_at; // Preserve creation date
                await updateTask(taskData);
            } else {
                taskData.created_at = new Date().toISOString();
                await addTask(taskData);
            }

            this.close();
            window.dispatchEvent(new CustomEvent('taskCreated')); // Trigger board refresh
        } catch (error) {
            console.error('Error saving task:', error);
            alert(i18n.getText('alert.save_error'));
        }
    }

}

export default TaskModal;