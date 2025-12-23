// Main entry point for the Clarity Board application
// Initializes the application, sets up event listeners, and handles the display of the project modal
import { exportProject, importProject } from './utils/importExport.js';
import { initializeBoardNavigation } from './navigation.js';
import { i18n } from './i18n/i18n.js';

import database from './database/database.js';
import ProjectModal from './components/projectModal.js';
import TaskModal from './components/taskModal.js';
import CategoryManager from './components/categoryManager.js';
import Board from './components/board.js';
import SettingsManager from './components/settingsManager.js';
import { getAllProjects, deleteProject, updateProject } from './database/projects.js';

class App {
    constructor() {
        this.settingsManager = null;
        this.projectModal = null;
        this.taskModal = null;
        this.categoryManager = null;
        this.currentBoard = null;
        this.currentProject = null;
        this.init();
    }

    async init() {
        try {
            // Initialize theme before everything
            this.initTheme();

            await database.init();
            console.log('Database initialized successfully');

            // Run migrations
            const { runMigrations } = await import('./database/migrations.js');
            await runMigrations();

            this.settingsManager = new SettingsManager();
            this.projectModal = new ProjectModal();
            this.categoryManager = new CategoryManager(null, 'non-numeric');
            this.taskModal = new TaskModal(null, 'non-numeric', this.categoryManager);
            this.initialChoiceModal = document.getElementById('initialChoiceModal');

            this.initEventListeners();
            await this.checkAndLoadProjects();
            initializeBoardNavigation();
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const mobileThemeToggle = document.getElementById('mobileThemeToggle');
        const themeIcons = document.querySelectorAll('.theme-icon');

        // const updateIcons = (currentTheme) => {
        //     themeIcons.forEach(icon => icon.textContent = currentTheme === 'dark' ? '🌙' : '☀️');
        // }

        const initialTheme = document.documentElement.getAttribute('data-theme');
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            // updateIcons(newTheme);
        });

        mobileThemeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            // updateIcons(newTheme);
        });

        // Detect system theme preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                updateIcons(newTheme);
            }
        });
    }

    initEventListeners() {
        document.getElementById('projectSelect').addEventListener('change', (e) => {
            const value = e.target.value;
            if (value === 'create-new') {
                this.projectModal.open();
                e.target.value = this.currentProject ? this.currentProject.id : '';
            } else if (value) {
                this.loadProject(parseInt(value));
            }
        });

        document.getElementById('mobileProjectSelect').addEventListener('change', (e) => {
            const value = e.target.value;
            if (value === 'create-new') {
                this.projectModal.open();
                e.target.value = this.currentProject ? this.currentProject.id : '';
            } else if (value) {
                this.loadProject(parseInt(value));
            }
            closeMenu(); // Close menu after selection
        });

        window.addEventListener('projectCreated', () => this.handleProjectCreated());
        window.addEventListener('taskCreated', () => this.handleTaskCreated());
        window.addEventListener('taskUpdated', () => this.handleTaskUpdated());
        window.addEventListener('categoriesUpdated', () => this.handleCategoriesUpdated());
        window.addEventListener('projectModalClosed', () => {
            if (!this.currentProject) {
                this.checkAndLoadProjects();
            }
        });

        const fab = document.getElementById('fabAddTask');
        fab.addEventListener('click', () => this.taskModal.openForCreate());

        document.getElementById('exportProjectBtn').addEventListener('click', () => {
            if (this.currentProject) {
                exportProject(this.currentProject.id);
            } else {
                alert(i18n.getText('alert.select_project_export'));
            }
        });

        // Manage Categories Button
        const manageCategoriesBtn = document.getElementById('manageCategoriesBtn');
        if (manageCategoriesBtn) {
            manageCategoriesBtn.addEventListener('click', () => {
                if (this.currentProject) {
                    this.categoryManager.open();
                } else {
                    alert(i18n.getText('alert.select_project'));
                }
            });
        }

        document.getElementById('importProjectBtn').addEventListener('click', () => {
            document.getElementById('importProjectInput').click();
        });

        document.getElementById('importProjectInput').addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                try {
                    await importProject(file);
                    await this.handleProjectImported();
                } catch (error) {
                    console.error('Error importing project:', error);
                    alert(i18n.getText('alert.import_fail'));
                }
            }
        });

        const menuToggle = document.getElementById('menuToggle');
        const closeMenuButton = document.getElementById('closeMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const closeMenu = () => {
            document.body.classList.remove('menu-open');
        };

        menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('menu-open');
        });

        closeMenuButton.addEventListener('click', closeMenu);
        menuOverlay.addEventListener('click', closeMenu);

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu();
        });

        // Settings Button
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                console.log('Settings button clicked');
                this.handleSettingsOpen();
            });
        }

        // Mobile Menu Buttons (connect to desktop button actions)
        const mobileCategoriesBtn = document.getElementById('mobileCategoriesBtn');
        if (mobileCategoriesBtn) {
            mobileCategoriesBtn.addEventListener('click', () => {
                closeMenu(); // Close menu first
                if (this.currentProject) {
                    this.categoryManager.open();
                } else {
                    alert(i18n.getText('alert.select_project'));
                }
            });
        }

        const mobileImportBtn = document.getElementById('mobileImportBtn');
        if (mobileImportBtn) {
            mobileImportBtn.addEventListener('click', () => {
                closeMenu(); // Close menu first
                document.getElementById('importProjectInput').click();
            });
        }

        const mobileExportBtn = document.getElementById('mobileExportBtn');
        if (mobileExportBtn) {
            mobileExportBtn.addEventListener('click', () => {
                closeMenu(); // Close menu first
                if (this.currentProject) {
                    exportProject(this.currentProject.id);
                } else {
                    alert(i18n.getText('alert.select_project_export'));
                }
            });
        }

        const mobileSettingsBtn = document.getElementById('mobileSettingsBtn');
        if (mobileSettingsBtn) {
            mobileSettingsBtn.addEventListener('click', () => {
                closeMenu(); // Close menu first
                this.handleSettingsOpen();
            });
        }

        // Event listeners for the initial choice modal
        const showCreateProjectModalBtn = document.getElementById('initialCreateBtn');
        const showImportProjectModalBtn = document.getElementById('initialImportBtn');

        if (showCreateProjectModalBtn) {
            showCreateProjectModalBtn.addEventListener('click', () => {
                this.closeInitialChoiceModal();
                this.projectModal.open();
            });
        }

        if (showImportProjectModalBtn) {
            showImportProjectModalBtn.addEventListener('click', () => {
                this.closeInitialChoiceModal();
                document.getElementById('importProjectInput').click();
            });
        }

        this.initDeleteLogic();
    }

    initDeleteLogic() {
        const deleteModal = document.getElementById('deleteProjectModal');
        const initBtn = document.getElementById('deleteProjectBtn');
        const cancelBtn = document.getElementById('cancelDeleteProjectBtn');
        const confirmBtn = document.getElementById('confirmDeleteProjectBtn');
        const input = document.getElementById('deleteProjectConfirmInput');

        // Early return if required elements don't exist
        if (!deleteModal || !initBtn || !cancelBtn || !confirmBtn || !input) {
            console.warn('Delete project modal elements not found, skipping initialization');
            return;
        }

        // Open Modal
        initBtn.addEventListener('click', () => {
            if (!this.currentProject) return;

            const settingsModal = document.getElementById('settingsModal');
            if (settingsModal) {
                settingsModal.classList.remove('active'); // Close settings
            }

            const nameDisplay = document.getElementById('deleteProjectNameDisplay');
            const nameConfirm = document.getElementById('deleteProjectNameConfirm');
            if (nameDisplay) nameDisplay.textContent = this.currentProject.name;
            if (nameConfirm) nameConfirm.textContent = this.currentProject.name;

            input.value = '';
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
            confirmBtn.style.cursor = 'not-allowed';

            deleteModal.classList.add('active');
            input.focus();
        });

        // Validate Input
        input.addEventListener('input', (e) => {
            const typedName = e.target.value;
            const isMatch = typedName === this.currentProject.name;

            confirmBtn.disabled = !isMatch;
            confirmBtn.style.opacity = isMatch ? '1' : '0.5';
            confirmBtn.style.cursor = isMatch ? 'pointer' : 'not-allowed';
        });

        // Confirm Delete
        confirmBtn.addEventListener('click', async () => {
            if (input.value === this.currentProject.name) {
                try {
                    await deleteProject(this.currentProject.id);
                    deleteModal.classList.remove('active');
                    this.currentProject = null;
                    await this.checkAndLoadProjects();
                } catch (error) {
                    console.error('Failed to delete project:', error);
                    alert('Error deleting project.');
                }
            }
        });

        // Cancel
        const closeDeleteModal = () => {
            deleteModal.classList.remove('active');
        };

        cancelBtn.addEventListener('click', closeDeleteModal);

        // Close when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === deleteModal) closeDeleteModal();
        });
    }

    async handleProjectImported() {
        this.closeInitialChoiceModal();
        await this.loadProjectSelector();
        const projects = await getAllProjects();
        if (projects.length > 0) {
            const lastProject = projects[projects.length - 1];
            document.getElementById('projectSelect').value = lastProject.id;
            document.getElementById('mobileProjectSelect').value = lastProject.id;
            await this.loadProject(lastProject.id);
            document.getElementById('fabAddTask').classList.add('visible');
        }
    }

    handleSettingsOpen() {
        try {
            const modal = document.getElementById('settingsModal');
            const form = document.getElementById('settingsForm');

            // Check if modal exists
            if (!modal || !form) {
                console.error('Settings modal or form not found');
                alert('Settings modal is not available');
                return;
            }

            const settings = this.settingsManager.getSettings();

            // Populate fields with null checks
            const settingsLanguage = document.getElementById('settingsLanguage');
            const urgencyWeight = document.getElementById('urgencyWeight');
            const urgencyWeightValue = document.getElementById('urgencyWeightValue');
            const categoriesWeight = document.getElementById('categoriesWeight');
            const categoriesWeightValue = document.getElementById('categoriesWeightValue');

            if (settingsLanguage) settingsLanguage.value = settings.language;
            if (urgencyWeight) urgencyWeight.value = settings.weights.urgency;
            if (urgencyWeightValue) urgencyWeightValue.textContent = settings.weights.urgency;
            if (categoriesWeight) categoriesWeight.value = settings.weights.categories;
            if (categoriesWeightValue) categoriesWeightValue.textContent = settings.weights.categories;

            // Populate Project Settings
            if (this.currentProject) {
                // Remove hidden class if it was added
                document.querySelector('[data-i18n="settings.project_settings"]').parentElement.style.display = 'block';

                document.getElementById('settingsProjectName').value = this.currentProject.name;
                const currentEmoji = this.currentProject.emoji || (this.currentProject.type === 'numeric' ? '🪙' : '✒️');
                document.getElementById('settingsEmojiPickerBtn').textContent = currentEmoji;
                document.getElementById('settingsSelectedEmoji').value = this.currentProject.emoji || '';

                // Setup Emoji Picker
                const defaultEmojis = [
                    '🚀', '💻', '🎨', '📝', '📅', '📊', '📈', '📉', '📁', '📂',
                    '🔒', '🔓', '🔑', '🔨', '🛠️', '⚙️', '🏗️', '🏠', '🏢', '🏦',
                    '🎓', '🎒', '📚', '💡', '🔦', '💰', '💴', '💵', '💳', '🧾',
                    '🛒', '🛍️', '🎁', '🏆', '🥇', '🎮', '🕹️', '🎲', '🧩', '🎯'
                ];

                const btn = document.getElementById('settingsEmojiPickerBtn');
                const menu = document.getElementById('settingsEmojiPickerMenu');
                const input = document.getElementById('settingsSelectedEmoji');

                // Render Options (if empty)
                if (menu.children.length === 0) {
                    menu.innerHTML = defaultEmojis.map(emoji =>
                        `<div class="emoji-option">${emoji}</div>`
                    ).join('');
                }

                // Toggle Menu - clone button to remove old listeners
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);

                newBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    menu.classList.toggle('active');
                });

                // Add emoji selection listeners AFTER button clone
                menu.querySelectorAll('.emoji-option').forEach(option => {
                    option.addEventListener('click', (e) => {
                        const emoji = e.target.textContent;
                        newBtn.textContent = emoji; // Update the NEW button
                        input.value = emoji;
                        menu.classList.remove('active');
                    });
                });

                const closePicker = (e) => {
                    if (!newBtn.contains(e.target) && !menu.contains(e.target)) {
                        menu.classList.remove('active');
                    }
                };
                window.addEventListener('click', closePicker);

                this.currentSettingsPickerCleaner = closePicker;
            } else {
                // Hide project settings if no project
                document.querySelector('[data-i18n="settings.project_settings"]').parentElement.style.display = 'none';
            }

            // Store original settings for revert
            const originalSettings = JSON.parse(JSON.stringify(settings));

            modal.classList.add('active');

            // Handle sliders and live preview
            const updateSlider = (id) => {
                const element = document.getElementById(id);
                const valueElement = document.getElementById(id + 'Value');
                if (!element || !valueElement) return;

                const value = element.value;
                valueElement.textContent = value;

                // Live Preview of Weights
                const urgencyWeightElem = document.getElementById('urgencyWeight');
                const categoriesWeightElem = document.getElementById('categoriesWeight');

                if (urgencyWeightElem && categoriesWeightElem) {
                    const tempSettings = {
                        weights: {
                            urgency: parseInt(urgencyWeightElem.value, 10),
                            categories: parseInt(categoriesWeightElem.value, 10)
                        }
                    };
                    this.settingsManager.previewSettings(tempSettings);
                }
            };

            if (urgencyWeight) urgencyWeight.oninput = () => updateSlider('urgencyWeight');
            if (categoriesWeight) categoriesWeight.oninput = () => updateSlider('categoriesWeight');

            // Handle submit
            form.onsubmit = async (e) => {
                e.preventDefault();

                // Save App Settings with null checks
                const langElem = document.getElementById('settingsLanguage');
                const urgElem = document.getElementById('urgencyWeight');
                const catElem = document.getElementById('categoriesWeight');

                if (langElem && urgElem && catElem) {
                    const newSettings = {
                        language: langElem.value,
                        weights: {
                            urgency: parseInt(urgElem.value, 10),
                            categories: parseInt(catElem.value, 10)
                        }
                    };
                    this.settingsManager.saveSettings(newSettings);
                }

                // Save Project Settings
                if (this.currentProject) {
                    const nameElem = document.getElementById('settingsProjectName');
                    const emojiElem = document.getElementById('settingsSelectedEmoji');

                    if (nameElem && emojiElem) {
                        const newName = nameElem.value;
                        const newEmoji = emojiElem.value;

                        if (newName) {
                            this.currentProject.name = newName;
                            this.currentProject.emoji = newEmoji;

                            try {
                                await updateProject(this.currentProject);
                                await this.loadProjectSelector();
                            } catch (error) {
                                console.error('Failed to update project:', error);
                            }
                        }
                    }
                }

                modal.classList.remove('active');
            };

            const closeAndRevert = () => {
                if (this.currentSettingsPickerCleaner) {
                    window.removeEventListener('click', this.currentSettingsPickerCleaner);
                    this.currentSettingsPickerCleaner = null;
                }
                this.settingsManager.previewSettings(originalSettings); // Revert to original
                modal.classList.remove('active');
            }

            // Close button
            const closeBtn = modal.querySelector('.close');
            if (closeBtn) {
                closeBtn.onclick = closeAndRevert;
            }

            window.onclick = (e) => {
                if (e.target === modal) closeAndRevert();
            };
        } catch (error) {
            console.error('Error opening settings:', error);
            // alert('Failed to open settings');
        }
    }

    closeInitialChoiceModal() {
        if (this.initialChoiceModal) {
            this.initialChoiceModal.classList.remove('active');
        }
    }

    async checkAndLoadProjects() {
        try {
            const projects = await getAllProjects();
            console.log('Projects loaded:', projects);

            document.getElementById('fabAddTask').classList.remove('visible');

            if (!projects || projects.length === 0) {
                console.log('No projects found. Showing Welcome Modal.');
                document.getElementById('boardContainer').innerHTML = `
                    <div class="empty-state">
                        <h2 data-i18n="board.empty_state.title">${i18n.getText('board.empty_state.title')}</h2>
                        <p data-i18n="board.empty_state.desc">${i18n.getText('board.empty_state.desc')}</p>
                    </div>
                `;
                this.initialChoiceModal.classList.add('active');

                // Clear selectors
                document.getElementById('projectSelect').innerHTML = `<option value="" data-i18n="header.project_select">${i18n.getText('header.project_select')}</option>`;
                document.getElementById('mobileProjectSelect').innerHTML = `<option value="" data-i18n="header.project_select">${i18n.getText('header.project_select')}</option>`;
                this.currentProject = null;
            } else {
                this.initialChoiceModal.classList.remove('active');
                await this.loadProjectSelector();

                const lastProjectId = localStorage.getItem('lastProjectId');
                let projectToLoad = projects[0];

                if (lastProjectId) {
                    const lastProject = projects.find(p => p.id === parseInt(lastProjectId));
                    if (lastProject) {
                        projectToLoad = lastProject;
                    }
                }

                document.getElementById('projectSelect').value = projectToLoad.id;
                document.getElementById('mobileProjectSelect').value = projectToLoad.id;
                await this.loadProject(projectToLoad.id);
                document.getElementById('fabAddTask').classList.add('visible');
            }
        } catch (error) {
            console.error('Error in checkAndLoadProjects:', error);
            // Fallback: show welcome modal to allow user to recover
            document.getElementById('boardContainer').innerHTML = `
                <div class="empty-state">
                    <h2>Welcome to Clarity Board!</h2>
                    <p>Let's get started by creating your first project or importing one.</p>
                </div>
            `;
            this.initialChoiceModal.classList.add('active');
            document.getElementById('projectSelect').innerHTML = `<option value="">Select Project</option>`;
            document.getElementById('mobileProjectSelect').innerHTML = `<option value="">Select Project</option>`;
            this.currentProject = null;
        }
    }

    async loadProjectSelector() {
        try {
            const desktopSelect = document.getElementById('projectSelect');
            const mobileSelect = document.getElementById('mobileProjectSelect');

            // Store current project ID before clearing
            const currentProjectId = this.currentProject ? this.currentProject.id : null;

            // Safer fetching
            let projects = [];
            try {
                projects = await getAllProjects();
            } catch (e) {
                console.error('Error fetching projects for selector:', e);
            }

            // Limpa ambos os seletores
            desktopSelect.innerHTML = '';
            mobileSelect.innerHTML = '';

            const selects = [desktopSelect, mobileSelect];

            selects.forEach(select => {
                select.innerHTML = `<option value="" data-i18n="header.project_select">${i18n.getText('header.project_select')}</option>`;

                if (projects && projects.length > 0) {
                    projects.forEach(project => {
                        const option = document.createElement('option');
                        option.value = project.id;
                        const icon = project.emoji || (project.type === 'numeric' ? '🪙' : '✒️');
                        option.textContent = `${icon} ${project.name}`;
                        select.appendChild(option);
                    });
                }

                select.innerHTML += `<option value="create-new" data-i18n="header.create_new">${i18n.getText('header.create_new')}</option>`;

                // Restore selection if current project exists
                if (currentProjectId) {
                    select.value = currentProjectId;
                }
            });
        } catch (error) {
            console.error('Error in loadProjectSelector:', error);
        }
    }

    async handleProjectCreated() {
        await this.loadProjectSelector();
        const projects = await getAllProjects();
        const lastProject = projects[projects.length - 1];
        if (lastProject) {
            document.getElementById('projectSelect').value = lastProject.id;
            document.getElementById('mobileProjectSelect').value = lastProject.id;
            await this.loadProject(lastProject.id);
            document.getElementById('fabAddTask').classList.add('visible');
        }
    }

    async handleTaskCreated() {
        if (this.currentBoard) {
            await this.currentBoard.render();
        }
    }

    async handleTaskUpdated() {
        if (this.currentBoard) {
            await this.currentBoard.render();
        }
    }

    async handleCategoriesUpdated() {
        if (this.currentBoard) {
            await this.taskModal.loadCategories();
        }
    }

    async loadProject(projectId) {
        try {
            const projects = await getAllProjects();
            this.currentProject = projects.find(p => p.id === projectId);

            if (this.currentProject) {
                localStorage.setItem('lastProjectId', projectId);
                this.categoryManager.setProject(projectId, this.currentProject.type);
                await this.taskModal.setProject(projectId, this.currentProject.type);
                this.currentBoard = new Board(projectId, this.currentProject.type, this.categoryManager, this.settingsManager);
                await this.currentBoard.render();
            } else {
                console.error('Project not found:', projectId);
            }
        } catch (error) {
            console.error('Error loading project:', error);
            alert('Failed to load project. Please try selecting another project or refresh the page.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});