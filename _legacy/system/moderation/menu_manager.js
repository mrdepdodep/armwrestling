// ========== MENU MANAGER (ОПТИМІЗОВАНО БЕЗ ЛАГІВ) ==========
(function() {
    'use strict';
    
    if (window.menuManagerInitialized) return;

    // ========== STATE ==========
    const state = {
        currentPosition: null,
        mobileMenuOpen: false,
        translations: null,
        initialized: false
    };

    // ========== CONFIG ==========
    const PAGE_ICONS = {
        calculator: '🐾', arm: '💪', grind: '🏋️‍♂️', roulette: '🎰', boss: '👹',
        boosts: '🚀', shiny: '✨', secret: '🔮', codes: '🎁', aura: '🌟',
        trainer: '🏆', charms: '🔮', worlds: '🌍',
        help: '🆘', peoples: '🙏'
    };

    const MENU_STRUCTURE = {
        aws: {
            id: 'awsCategory',
            icon: '📦',
            subcategories: {
                calculator: { id: 'calculatorButtons', icon: '🧮', pages: ['calculator', 'arm', 'grind', 'roulette', 'boss'] },
                info: { id: 'infoButtons', icon: '📋', pages: ['boosts', 'shiny', 'secret', 'codes', 'aura', 'trainer', 'charms', 'worlds'] }
            }
        },
        system: {
            id: 'systemCategory',
            icon: '⚙️',
            pages: ['help', 'peoples']
        }
    };

    // ========== STORAGE ==========
    const storage = {
        get: (key, def) => localStorage.getItem(`armHelper_${key}`) || def,
        set: (key, val) => localStorage.setItem(`armHelper_${key}`, val)
    };

    // ========== TRANSLATIONS ==========
    async function loadTranslations() {
        if (state.translations) return state.translations;
        
        try {
            const response = await fetch('system/moderation/menu.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            state.translations = await response.json();
            return state.translations;
        } catch (error) {
            console.error('❌ Menu translation error:', error);
            return null;
        }
    }

    function getTranslation(key) {
        const lang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
        if (!state.translations?.[lang]?.menu) return '';
        
        const parts = key.split('.');
        let value = state.translations[lang].menu;
        
        for (const part of parts) {
            value = value?.[part];
            if (!value) return '';
        }
        
        return value;
    }

    // ========== MOBILE MENU (LEFT/RIGHT) ========== 
    const mobileMenu = {
        toggleHandler: null,
        overlayHandler: null,

        init() {
            this.setupToggleButton();
            this.attachEvents();
        },

        setupToggleButton() {
            const toggle = document.querySelector('.mobile-menu-toggle');
            if (!toggle) return;

            toggle.innerHTML = `
                <div class="menu-line" style="top: calc(50% - 8px); transform: translateX(-50%)"></div>
                <div class="menu-line" style="top: 50%; transform: translateX(-50%)"></div>
                <div class="menu-line" style="top: calc(50% + 8px); transform: translateX(-50%)"></div>
            `;
        },

        attachEvents() {
            const toggle = document.querySelector('.mobile-menu-toggle');
            const overlay = document.getElementById('sidebarOverlay');

            // Видаляємо старі обробники
            if (this.toggleHandler) {
                toggle?.removeEventListener('click', this.toggleHandler);
            }
            if (this.overlayHandler) {
                overlay?.removeEventListener('click', this.overlayHandler);
            }

            // Створюємо нові обробники
            this.toggleHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggle();
            };

            this.overlayHandler = () => this.close();

            toggle?.addEventListener('click', this.toggleHandler);
            overlay?.addEventListener('click', this.overlayHandler);
        },

        toggle() {
            const sidebar = document.getElementById('sidebar');
            if (!sidebar) return;

            const isOpen = sidebar.classList.contains('open');
            isOpen ? this.close() : this.open();
        },

        open() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            const toggle = document.querySelector('.mobile-menu-toggle');

            sidebar?.classList.add('open');
            overlay?.classList.add('show');
            toggle?.classList.add('menu-open');
            state.mobileMenuOpen = true;
        },

        close() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            const toggle = document.querySelector('.mobile-menu-toggle');

            sidebar?.classList.remove('open');
            overlay?.classList.remove('show');
            toggle?.classList.remove('menu-open');
            state.mobileMenuOpen = false;
        },

        cleanup() {
            this.close();
            
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            const toggle = document.querySelector('.mobile-menu-toggle');

            if (sidebar) sidebar.style.cssText = '';
            if (overlay) overlay.style.cssText = '';
            if (toggle) toggle.style.cssText = '';

            // Видаляємо обробники
            if (this.toggleHandler) {
                toggle?.removeEventListener('click', this.toggleHandler);
                this.toggleHandler = null;
            }
            if (this.overlayHandler) {
                overlay?.removeEventListener('click', this.overlayHandler);
                this.overlayHandler = null;
            }
        }
    };

    // ========== STATIC MENU (TOP/BOTTOM) ==========
    const staticMenu = {
        outsideClickHandler: null,

        create(position) {
            const isTop = position === 'up';
            const menuId = isTop ? 'staticMenuTop' : 'staticMenuBottom';

            // Remove existing
            document.querySelectorAll('.static-menu').forEach(m => m.remove());

            const menu = document.createElement('div');
            menu.id = menuId;
            menu.className = `static-menu menu-${isTop ? 'top' : 'bottom'}`;

            menu.innerHTML = `
                <div class="menu-categories">
                    ${this.createCategories()}
                </div>
                <div class="settings-container-static">
                    <button class="theme-toggle-btn" onclick="toggleColorTheme()" title="Toggle theme">🌙</button>
                    <div class="lang-buttons">
                        <button class="lang-flag-btn" data-lang="en" onclick="switchAppLanguage('en')">EN</button>
                        <button class="lang-flag-btn" data-lang="uk" onclick="switchAppLanguage('uk')">UK</button>
                        <button class="lang-flag-btn" data-lang="ru" onclick="switchAppLanguage('ru')">RU</button>
                    </div>
                </div>
            `;

            document.body.appendChild(menu);
            
            // Одразу оновлюємо переклади без затримки
            requestAnimationFrame(() => {
                this.updateTranslations();
                this.attachEvents(menuId);
                if (typeof updateThemeToggleUI === 'function') updateThemeToggleUI();
                const lang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
                menu.querySelectorAll('.lang-flag-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.lang === lang);
                });
            });
        },

        createCategories() {
            let html = '';
            html += this.createCategory('aws', MENU_STRUCTURE.aws);
            html += this.createCategoryDirect('system', MENU_STRUCTURE.system);
            return html;
        },

        createCategory(key, config) {
            const subcatsHTML = Object.entries(config.subcategories).map(([subKey, subConfig]) => {
                const pagesHTML = subConfig.pages.map(page => 
                    `<div class="dropdown-item" data-page="${page}" onclick="switchPage('${page}')">
                        <span class="dropdown-item-icon">${PAGE_ICONS[page] || '📄'}</span>
                        <span class="dropdown-item-text" data-translate="pages.${page}">${getTranslation('pages.' + page) || page}</span>
                    </div>`
                ).join('');

                return `
                    <div class="dropdown-subcategory-header">
                        <span>${subConfig.icon}</span>
                        <span data-translate="${subKey}">${getTranslation(subKey) || subKey}</span>
                    </div>
                    <div class="subcategory-items">${pagesHTML}</div>
                `;
            }).join('');

            return `
                <div class="menu-category" data-category="${config.id}">
                    <button class="category-btn">
                        <span>${config.icon}</span>
                        <span data-translate="${config.id}">${getTranslation(config.id) || config.id}</span>
                    </button>
                    <div class="category-dropdown">${subcatsHTML}</div>
                </div>
            `;
        },

        createCategoryDirect(key, config) {
            const pagesHTML = config.pages.map(page => 
                `<div class="dropdown-item" data-page="${page}" onclick="switchPage('${page}')">
                    <span class="dropdown-item-icon">${PAGE_ICONS[page] || '📄'}</span>
                    <span class="dropdown-item-text" data-translate="pages.${page}">${getTranslation('pages.' + page) || page}</span>
                </div>`
            ).join('');

            return `
                <div class="menu-category" data-category="${config.id}">
                    <button class="category-btn">
                        <span>${config.icon}</span>
                        <span data-translate="${config.id}">${getTranslation(config.id) || config.id}</span>
                    </button>
                    <div class="category-dropdown">${pagesHTML}</div>
                </div>
            `;
        },

        attachEvents(menuId) {
            const menu = document.getElementById(menuId);
            if (!menu) return;

            menu.querySelectorAll('.category-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const category = btn.closest('.menu-category');
                    const dropdown = category.querySelector('.category-dropdown');
                    const isOpen = dropdown.classList.contains('show');
                    
                    // Close all
                    menu.querySelectorAll('.category-dropdown').forEach(d => d.classList.remove('show'));
                    menu.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));

                    // Open current if was closed
                    if (!isOpen) {
                        dropdown.classList.add('show');
                        btn.classList.add('active');
                    }
                });
            });

            // Outside click handler
            if (this.outsideClickHandler) {
                document.removeEventListener('click', this.outsideClickHandler);
            }

            this.outsideClickHandler = (e) => {
                if (!e.target.closest('.static-menu')) {
                    menu.querySelectorAll('.category-dropdown').forEach(d => d.classList.remove('show'));
                    menu.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                }
            };

            document.addEventListener('click', this.outsideClickHandler);
            this.updateActiveState();
        },

        updateTranslations() {
            if (!state.translations) return;

            const lang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
            const menuTranslations = state.translations[lang]?.menu;
            if (!menuTranslations) return;

            // Batch DOM updates using DocumentFragment
            document.querySelectorAll('.static-menu [data-translate]').forEach(el => {
                const key = el.getAttribute('data-translate');
                let text = '';
                
                if (key === 'awsCategory') text = menuTranslations.awsCategory;
                else if (key === 'systemCategory') text = menuTranslations.systemCategory;
                else if (key === 'calculator') text = menuTranslations.calculator;
                else if (key === 'info') text = menuTranslations.info;
                else if (key.startsWith('pages.')) {
                    const pageKey = key.replace('pages.', '');
                    text = menuTranslations.pages?.[pageKey] || '';
                }
                
                if (text) el.textContent = text;
            });
        },

        updateActiveState(page) {
            const currentPage = page || (typeof getCurrentPage === 'function' ? getCurrentPage() : null);
            if (!currentPage) return;

            document.querySelectorAll('.static-menu .dropdown-item').forEach(item => {
                item.classList.toggle('active', item.dataset.page === currentPage);
            });
        },

        cleanup() {
            document.querySelectorAll('.static-menu').forEach(m => m.remove());
            document.body.style.paddingTop = '';
            document.body.style.paddingBottom = '';
            
            if (this.outsideClickHandler) {
                document.removeEventListener('click', this.outsideClickHandler);
                this.outsideClickHandler = null;
            }
        }
    };

    // ========== POSITION MANAGER ========== 
    const menuPositionManager = {
        apply(position) {
            // 1. Cleanup
            this.completeCleanup();

            // 2. Remove all position classes
            document.body.classList.remove('menu-left', 'menu-right', 'menu-up', 'menu-down');

            // 3. Set new state
            state.currentPosition = position;

            // 4. Apply new position
            document.body.classList.add(`menu-${position}`);

            // 5. Initialize menu (without setTimeout - instant)
            requestAnimationFrame(() => {
                if (position === 'left' || position === 'right') {
                    mobileMenu.init();
                } else {
                    staticMenu.create(position);
                }
            });
        },

        completeCleanup() {
            mobileMenu.cleanup();
            staticMenu.cleanup();
            document.body.classList.remove('menu-left', 'menu-right', 'menu-up', 'menu-down');
            document.body.style.paddingTop = '';
            document.body.style.paddingBottom = '';
        },

        init() {
            const savedPosition = storage.get('menuPosition', 'left');
            this.apply(savedPosition);
        },

        updateActiveState(page) {
            const position = state.currentPosition;
            
            if (position === 'left' || position === 'right') {
                document.querySelectorAll('.sidebar .nav-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.page === page);
                });
            } else {
                staticMenu.updateActiveState(page);
            }
        }
    };

    // ========== GLOBAL FUNCTIONS ==========
    window.toggleMobileMenu = () => mobileMenu.toggle();
    window.closeSidebar = () => mobileMenu.close();

    // ========== INITIALIZATION ==========
    async function init() {
        if (state.initialized) return;

        await loadTranslations();
        menuPositionManager.init();

        // Language changes
        document.addEventListener('languageChanged', () => {
            staticMenu.updateTranslations();
        });

        // Page changes
        document.addEventListener('pageChanged', (e) => {
            if (e.detail?.page) {
                menuPositionManager.updateActiveState(e.detail.page);
                mobileMenu.close();
            }
        });

        state.initialized = true;
    }

    // ========== EXPORTS ==========
    window.menuPositionManager = menuPositionManager;

    // ========== AUTO INIT ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.menuManagerInitialized = true;

})();
