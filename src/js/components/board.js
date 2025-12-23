import { getAllTasks, updateTask, deleteTask } from '../database/tasks.js';
import { getCategoryById } from '../database/categories.js';
import { getNumericCategoryById } from '../database/categories_numeric.js';
import { i18n } from '../i18n/i18n.js';
import { translateCategoryName } from '../utils/categoryTranslation.js';

class Board {
    constructor(projectId, projectType, categoryManager, settingsManager) {
        this.projectId = projectId;
        this.projectType = projectType;
        this.categoryManager = categoryManager;
        this.settingsManager = settingsManager;
        this.tasks = [];

        // Listen for settings updates to re-render/re-sort
        window.addEventListener('settingsUpdated', () => {
            this.renderTasksInColumns();
        });
    }



    async loadTasks() {
        try {
            const allTasks = await getAllTasks();
            this.tasks = allTasks.filter(task => task.projectId === this.projectId);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    async render() {
        console.log('Board: render started');
        await this.loadTasks();
        console.log('Board: tasks loaded');

        const container = document.getElementById('boardContainer');
        if (!container) {
            console.error('Board container not found!');
            return;
        }

        try {
            // Restore Nav Buttons if they are wiped (Logic needs improvement later)
            // Ideally we shouldn't wipe the whole container if nav is there.
            // But for now, let's just render the board.
            container.innerHTML = `
                <div class="board-columns">
                    <div class="column backlog">
                        <div class="column-header" data-i18n="board.backlog">${i18n.getText('board.backlog')}</div>
                        <div class="task-list" id="backlog"></div>
                        <button class="add-task-btn" data-status="backlog" data-i18n="board.add_task">${i18n.getText('board.add_task')}</button>
                    </div>
                    <div class="column selected">
                        <div class="column-header" data-i18n="board.selected">${i18n.getText('board.selected')}</div>
                        <div class="task-list" id="selected"></div>
                        <button class="add-task-btn" data-status="selected" data-i18n="board.add_task">${i18n.getText('board.add_task')}</button>
                    </div>
                    <div class="column progress">
                        <div class="column-header" data-i18n="board.progress">${i18n.getText('board.progress')}</div>
                        <div class="task-list" id="progress"></div>
                        <button class="add-task-btn" data-status="progress" data-i18n="board.add_task">${i18n.getText('board.add_task')}</button>
                    </div>
                    <div class="column done">
                        <div class="column-header" data-i18n="board.done">${i18n.getText('board.done')}</div>
                        <div class="task-list" id="done"></div>
                        <button class="add-task-btn" data-status="done" data-i18n="board.add_task">${i18n.getText('board.add_task')}</button>
                    </div>
                </div>
            `;
            console.log('Board: innerHTML updated');
        } catch (e) {
            console.error('Board: Error rendering HTML', e);
        }

        await this.renderTasksInColumns();


        document.querySelectorAll('.add-task-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const status = btn.dataset.status;
                window.dispatchEvent(new CustomEvent('openTaskModal', { detail: { status } }));
            });
        });

        // Setup Priority Filtering
        this.setupPriorityFilter();
    }

    setupPriorityFilter() {
        const dots = document.querySelectorAll('.header-controls .color-dot');
        dots.forEach(dot => {
            // Remove existing listeners to avoid duplicates if re-rendered
            const newDot = dot.cloneNode(true);
            dot.parentNode.replaceChild(newDot, dot);

            newDot.addEventListener('click', async (e) => {
                const priority = e.target.classList.contains('high') ? 'high' :
                    e.target.classList.contains('medium') ? 'medium' : 'low';

                const container = e.target.closest('.color-indicators');

                // Toggle active state
                if (e.target.classList.contains('active')) {
                    e.target.classList.remove('active');
                    container.classList.remove('has-selection');
                    this.activeFilter = null;
                } else {
                    document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                    e.target.classList.add('active');
                    container.classList.add('has-selection');
                    this.activeFilter = priority;
                }

                await this.renderTasksInColumns();
            });
        });
    }

    async renderTasksInColumns() {
        const statusMap = {
            backlog: 'backlog',
            selected: 'selected',
            progress: 'progress',
            done: 'done'
        };

        // Clear columns first
        for (const columnId of Object.values(statusMap)) {
            document.getElementById(columnId).innerHTML = '';
        }

        for (const [status, columnId] of Object.entries(statusMap)) {
            const column = document.getElementById(columnId);
            let tasksInStatus = this.tasks.filter(task => task.status === status);

            // Apply Priority Filter
            if (this.activeFilter) {
                tasksInStatus = await this.filterTasksByPriority(tasksInStatus, this.activeFilter);
            }

            // Calculate scores for sorting
            const tasksWithScore = await Promise.all(tasksInStatus.map(async task => {
                let categoryImportance = 0; // Default if no category
                if (task.FK_categories_id) {
                    const cat = await getCategoryById(task.FK_categories_id);
                    if (cat) categoryImportance = cat.importance;
                } else if (task.FK_categories_numeric_id) {
                    const cat = await getNumericCategoryById(task.FK_categories_numeric_id);
                    if (cat) categoryImportance = cat.importance;
                }

                // Urgency values
                const urgencyMap = { 'high': 3, 'medium': 2, 'low': 1 };
                const urgencyValue = urgencyMap[task.urgency || 'low'] || 1;

                const weights = this.settingsManager ? this.settingsManager.getSettings().weights : { urgency: 1, categories: 1 };

                const score = (urgencyValue * weights.urgency) + (categoryImportance * (weights.categories || 1));

                return { task, score };
            }));

            // Sort descending by score
            // Multi-level sorting:
            // 1. Schedule Date Ascending (if present)
            // 2. Score Descending (if no schedule)
            tasksWithScore.sort((a, b) => {
                const scheduleA = a.task.schedule;
                const scheduleB = b.task.schedule;

                if (scheduleA && scheduleB) {
                    return new Date(scheduleA) - new Date(scheduleB);
                }
                if (scheduleA) return -1; // A comes first
                if (scheduleB) return 1;  // B comes first

                // Fallback to score
                return b.score - a.score;
            });

            for (const item of tasksWithScore) {
                const taskCard = await this.createTaskCard(item.task);
                column.appendChild(taskCard);
            }
        }
    }

    async filterTasksByPriority(tasks, priority) {
        const filtered = [];
        for (const task of tasks) {
            let category = null;
            if (task.FK_categories_id) {
                category = await getCategoryById(task.FK_categories_id);
            } else if (task.FK_categories_numeric_id) {
                category = await getNumericCategoryById(task.FK_categories_numeric_id);
            }

            // Determine effective priority (Urgency > Category)
            let taskPriority = task.urgency || 'low';

            // Legacy fallback
            if (!task.urgency && category) {
                const pClass = this.getPriorityClass(category.importance);
                taskPriority = pClass.replace('priority-', '');
            }

            if (taskPriority === priority) {
                filtered.push(task);
            }
        }
        return filtered;
    }

    async createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card';
        if (task.status === 'done') {
            card.classList.add('done');
        }

        // Add click listener for editing
        card.addEventListener('click', () => {
            this.openEditModal(task);
        });

        // Obtém a categoria
        let category = null;
        if (task.FK_categories_id) {
            category = await getCategoryById(task.FK_categories_id);
        } else if (task.FK_categories_numeric_id) {
            category = await getNumericCategoryById(task.FK_categories_numeric_id);
        }

        // Determine priority class based on urgency
        let priorityClass = 'priority-' + (task.urgency || 'low');

        // Fallback to category-based priority if urgency is not set and category exists (legacy support)
        if (!task.urgency && category) {
            priorityClass = this.getPriorityClass(category.importance);
        }

        card.classList.add(priorityClass);

        let metaHTML = '';
        if (category) {
            metaHTML = `
                <div class="task-meta">
                    <span class="task-category" style="--category-color: ${category.color};">
                        ${translateCategoryName(category.name)}
                    </span>
                    ${this.projectType === 'numeric' && task.numeric !== null ?
                    `<span class="task-numeric">${task.numeric}</span>` : ''}
                </div>
            `;
        }

        const statusActions = this.getStatusActions(task.status);

        // Date Logic
        let dateHTML = '';
        if (task.schedule) {
            const dateObj = new Date(task.schedule);
            // Format: DD/MM/YYYY or locale default
            const dateStr = dateObj.toLocaleDateString(i18n.getLanguage());
            dateHTML = `<div class="task-date schedule" style="margin-bottom: 8px; font-size: 12px; font-weight: 600; color: var(--color-primary);">
                <span class="icon">📅</span> ${dateStr}
            </div>`;
        }

        card.innerHTML = `
            ${dateHTML}
            <h4>${task.name}</h4>
            <p>${task.description}</p>
            ${metaHTML}
            <div class="task-actions">
                ${statusActions.back ? `<button class="btn-back" data-action="back" data-id="${task.id}" data-i18n="common.back">${i18n.getText('common.back')}</button>` : ''}
                ${statusActions.next ? `<button class="btn-next" data-action="next" data-id="${task.id}" data-i18n="common.next">${i18n.getText('common.next')}</button>` : ''}
                <button class="btn-delete" data-action="delete" data-id="${task.id}"><span data-i18n="common.remove">${i18n.getText('common.remove')}</span></button>
            </div>
        `;


        card.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click
                this.handleTaskAction(btn.dataset.action, parseInt(btn.dataset.id));
            });
        });

        return card;
    }

    openEditModal(task) {
        window.dispatchEvent(new CustomEvent('openTaskModal', { detail: { task } }));
    }

    getPriorityClass(importance) {
        // Handle legacy 1-3 scale if present
        if (importance <= 3) {
            switch (importance) {
                case 3: return 'priority-high';
                case 2: return 'priority-medium';
                case 1: return 'priority-low';
                default: return 'priority-medium';
            }
        }

        // Handle new 0-100 scale
        if (importance >= 67) return 'priority-high';
        if (importance >= 34) return 'priority-medium';
        return 'priority-low';
    }

    getStatusActions(status) {
        const actions = {
            backlog: { back: false, next: true },
            selected: { back: true, next: true },
            progress: { back: true, next: true },
            done: { back: true, next: false }
        };
        return actions[status] || { back: false, next: false };
    }

    async handleTaskAction(action, taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        if (action === 'delete') {
            if (confirm(i18n.getText('modal.task.delete_confirm'))) {
                await deleteTask(taskId);
                window.dispatchEvent(new CustomEvent('taskUpdated'));
            }
            return;
        }

        const statusFlow = ['backlog', 'selected', 'progress', 'done'];
        const currentIndex = statusFlow.indexOf(task.status);

        if (action === 'next' && currentIndex < statusFlow.length - 1) {
            task.status = statusFlow[currentIndex + 1];
        } else if (action === 'back' && currentIndex > 0) {
            task.status = statusFlow[currentIndex - 1];
        }

        await updateTask(task);
        window.dispatchEvent(new CustomEvent('taskUpdated'));
    }
}

export default Board;
