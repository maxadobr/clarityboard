import { translations } from './translations.js';

class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en-US';
        this.translations = translations;
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            this.applyToPage();
            return true;
        }
        return false;
    }

    getLanguage() {
        return this.currentLang;
    }

    getText(key) {
        const langData = this.translations[this.currentLang];
        return langData[key] || key; // Fallback to key if not found
    }

    applyToPage() {
        // Update all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.getText(key);

            // Check if it's an input/textarea placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.hasAttribute('placeholder')) {
                    // If element has data-i18n-placeholder specifically
                    // But usually data-i18n implies textContent. 
                    // Let's assume data-i18n targets textContent, unless we add data-i18n-placeholder.
                }
                // If the key maps to a placeholder text, we might want to set placeholder.
                // But for now, data-i18n sets textContent.
                // We need a strategy for attributes.
            } else {
                // Check if element should use innerHTML (for texts with HTML tags)
                if (element.hasAttribute('data-i18n-html') || element.classList.contains('danger-warning')) {
                    element.innerHTML = text;
                } else {
                    element.textContent = text;
                }
            }
        });

        // Update elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.getText(key);
        });

        // Update elements with data-i18n-title
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.getText(key);
        });

        // Dispatch event for components to listen to
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: this.currentLang } }));
    }
}


export const i18n = new I18n();
