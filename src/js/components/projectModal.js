import { addProject, getAllProjects } from '../database/projects.js';
import { addDefaultCategories } from '../database/categories.js';
import { i18n } from '../i18n/i18n.js';

const defaultEmojis = [
    '🚀', '💻', '🎨', '📝', '📅', '📊', '📈', '📉', '📁', '📂',
    '🔒', '🔓', '🔑', '🔨', '🛠️', '⚙️', '🏗️', '🏠', '🏢', '🏦',
    '🎓', '🎒', '📚', '💡', '🔦', '💰', '💴', '💵', '💳', '🧾',
    '🛒', '🛍️', '🎁', '🏆', '🥇', '🎮', '🕹️', '🎲', '🧩', '🎯'
];

class ProjectModal {
    constructor() {
        this.modal = document.getElementById('projectModal');
        this.form = document.getElementById('projectForm');
        this.closeBtn = this.modal.querySelector('.close[data-modal="project"]');

        this.initEventListeners();
        this.initEmojiPicker();
    }

    initEventListeners() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    initEmojiPicker() {
        const btn = document.getElementById('emojiPickerBtn');
        const menu = document.getElementById('emojiPickerMenu');
        const input = document.getElementById('selectedEmoji');

        // Render Options
        menu.innerHTML = defaultEmojis.map(emoji =>
            `<div class="emoji-option">${emoji}</div>`
        ).join('');

        // Toggle Menu
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
        });

        // Select Emoji
        menu.querySelectorAll('.emoji-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const emoji = e.target.textContent;
                btn.textContent = emoji;
                input.value = emoji;
                menu.classList.remove('active');
            });
        });

        // Close on Outside Click
        window.addEventListener('click', (e) => {
            if (!btn.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('active');
            }
        });
    }

    open() {
        this.modal.classList.add('active');
        // Reset picker state
        document.getElementById('emojiPickerBtn').textContent = '✒️';
        document.getElementById('selectedEmoji').value = '';
    }

    close() {
        this.modal.classList.remove('active');
        this.form.reset();
        window.dispatchEvent(new CustomEvent('projectModalClosed'));
    }

    async handleSubmit(e) {
        e.preventDefault();

        const projectData = {
            name: document.getElementById('projectName').value,
            emoji: document.getElementById('selectedEmoji').value,
            task: 0,
            completion: '0%',
            type: document.getElementById('projectType').value
        };

        try {
            const projectId = await addProject(projectData);
            await addDefaultCategories(projectId, projectData.type);
            this.modal.classList.remove('active');
            this.form.reset();

            const initialChoiceModal = document.getElementById('initialChoiceModal');
            if (initialChoiceModal && initialChoiceModal.classList.contains('active')) {
                initialChoiceModal.classList.remove('active');
            }
            window.dispatchEvent(new CustomEvent('projectCreated', { detail: { projectId } }));
        } catch (error) {
            console.error('Error creating project:', error);
            alert(i18n.getText('alert.create_project_error'));
        }
    }
}

export default ProjectModal;