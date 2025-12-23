import { i18n } from '../i18n/i18n.js';

export default class SettingsManager {
    constructor() {
        this.defaultSettings = {
            language: 'en-US',
            weights: {
                urgency: 1.0,
                categories: 1.0
            }
        };

        this.settings = this.loadSettings();
        this.init();
    }

    init() {
        // Apply initial settings
        this.applySettings(this.settings);
    }

    loadSettings() {
        const stored = localStorage.getItem('claritySettings');
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            language: 'en-US',
            weights: {
                urgency: 1.0,
                categories: 1.0
            }
        };
    }

    saveSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('claritySettings', JSON.stringify(this.settings));
        this.applyLanguage(this.settings.language);
        window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: this.settings }));
    }

    previewSettings(tempSettings) {
        this.settings = { ...this.settings, ...tempSettings };
        // We don't save to localStorage here
        window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: this.settings }));
    }

    getSettings() {
        return this.settings;
    }

    applySettings(settings) {
        if (settings.language) {
            this.applyLanguage(settings.language);
        }
    }

    applyLanguage(lang) {
        i18n.setLanguage(lang);
    }

    getText(key) {
        return i18n.getText(key);
    }
}
