// ========== CONTENT LOADER (AWS + RCU + System - NO MENU LOGIC) ==========

// Конфігурація іконок для сторінок
const PAGE_ICONS = {
    calculator: '🐾', arm: '💪', grind: '🏋️‍♂️', roulette: '🎰', boss: '👹',
    boosts: '🚀', shiny: '✨', secret: '🔮', codes: '🎁', aura: '🌟',
    trainer: '🏆', charms: '🔮', worlds: '🌍',
    help: '🆘', peoples: '🙏'
};

async function loadContent() {
    try {
        const baseTag = document.querySelector('base');
        const basePath = baseTag ? new URL(baseTag.href).pathname : '';
        
        // Load AWS content
        const awsContentURL = basePath ? `${basePath}AWS/system/content.html` : 'AWS/system/content.html';
        console.log('📦 Loading AWS content from:', awsContentURL);
        
        const awsResponse = await fetch(awsContentURL);
        if (!awsResponse.ok) throw new Error(`HTTP ${awsResponse.status}`);
        const awsHTML = await awsResponse.text();

        // Load System content
        const systemContentURL = basePath ? `${basePath}system/system_content/system_content.html` : 'system/system_content/system_content.html';
        console.log('📦 Loading System content from:', systemContentURL);

        const systemResponse = await fetch(systemContentURL);
        if (!systemResponse.ok) throw new Error(`HTTP ${systemResponse.status}`);
        const systemHTML = await systemResponse.text();

        // Combine content (AWS + System)
        const combinedContent = awsHTML + '\n' + systemHTML;
        
        const appContent = document.getElementById('app-content');
        if (!appContent) {
            console.error('❌ app-content not found');
            return;
        }

        appContent.innerHTML = createAppStructure(combinedContent);
        console.log('✅ Content structure created (AWS + RCU + System)');

        setTimeout(() => {
            if (typeof window.initializeApp === 'function') {
                window.initializeApp();
            } else if (typeof window.updateMenuTranslations === 'function') {
                window.updateMenuTranslations();
                window.updatePageTitles?.();
            }
            if (typeof window.updateThemeToggleUI === 'function') {
                window.updateThemeToggleUI();
            }
        }, 0);

        document.dispatchEvent(new CustomEvent('contentLoaded'));
        
        console.log('✅ Content loaded (AWS + RCU + System)');
        
    } catch (error) {
        console.error('❌ Error loading content:', error);
        document.dispatchEvent(new CustomEvent('contentLoadError', { detail: error }));
    }
}

function createAppStructure(contentHTML) {
    return `
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h3></h3>
                <button class="close-sidebar" onclick="window.closeSidebar(); return false;">×</button>
            </div>
            <div class="nav-buttons">
                ${createMainCategory('awsCategory', '📦', [
                    { id: 'calculatorButtons', icon: '🧮', pages: ['calculator', 'arm', 'grind', 'roulette', 'boss'] },
                    { id: 'infoButtons', icon: '📋', pages: ['boosts', 'shiny', 'secret', 'codes', 'aura', 'trainer', 'charms', 'worlds'] }
                ])}

                ${createMainCategoryDirect('systemCategory', '⚙️', ['help', 'peoples'])}
            </div>

            <div class="sidebar-controls" id="sidebarControls">
                <button class="theme-toggle-btn" onclick="toggleColorTheme()" title="Toggle theme">🌙</button>
                <div class="lang-buttons">
                    <button class="lang-flag-btn" data-lang="en" onclick="switchAppLanguage('en')">EN</button>
                    <button class="lang-flag-btn" data-lang="uk" onclick="switchAppLanguage('uk')">UK</button>
                    <button class="lang-flag-btn" data-lang="ru" onclick="switchAppLanguage('ru')">RU</button>
                </div>
            </div>
        </div>

        <div class="sidebar-overlay" id="sidebarOverlay" onclick="window.closeSidebar(); return false;"></div>
        
        <button class="mobile-menu-toggle" onclick="window.toggleMobileMenu(); return false;">☰</button>
           
        <div class="container">${contentHTML}</div>
    `;
}

function createMainCategory(id, icon, subcategories) {
    return `
        <div class="main-category">
            <div class="main-category-header" data-main-category="${id}" onclick="toggleMainCategory('${id}')">
                <div class="main-category-title">
                    <span class="main-category-icon">${icon}</span>
                    <span class="main-category-text"></span>
                </div>
                <span class="main-category-toggle">▼</span>
            </div>
            <div class="main-category-content" id="${id}">
                ${subcategories.map(sub => createNavCategory(sub.id, sub.icon, sub.pages)).join('')}
            </div>
        </div>
    `;
}

function createMainCategoryDirect(id, icon, pages) {
    return `
        <div class="main-category">
            <div class="main-category-header" data-main-category="${id}" onclick="toggleMainCategory('${id}')">
                <div class="main-category-title">
                    <span class="main-category-icon">${icon}</span>
                    <span class="main-category-text"></span>
                </div>
                <span class="main-category-toggle">▼</span>
            </div>
            <div class="main-category-content main-category-direct" id="${id}">
                ${pages.map(page => 
                    `<button class="nav-btn" data-page="${page}" onclick="switchPage('${page}')">
                        <span class="nav-btn-icon">${PAGE_ICONS[page] || '📄'}</span>
                        <span class="nav-btn-text"></span>
                    </button>`
                ).join('')}
            </div>
        </div>
    `;
}

function createNavCategory(id, icon, pages) {
    return `
        <div class="nav-category">
            <div class="category-header" data-category="${id}" onclick="toggleCategory('${id}')">
                <div class="category-title">
                    <span class="category-icon">${icon}</span>
                    <span class="category-text"></span>
                </div>
                <span class="category-toggle">▼</span>
            </div>
            <div class="category-buttons" id="${id}">
                ${pages.map(page => 
                    `<button class="nav-btn" data-page="${page}" onclick="switchPage('${page}')">
                        <span class="nav-btn-icon">${PAGE_ICONS[page] || '📄'}</span>
                        <span class="nav-btn-text"></span>
                    </button>`
                ).join('')}
            </div>
        </div>
    `;
}

// ========== CATEGORY MANAGEMENT ==========

function toggleMainCategory(mainCategoryId) {
    const mainContent = document.getElementById(mainCategoryId);
    const toggleIcon = document.querySelector(`[data-main-category="${mainCategoryId}"] .main-category-toggle`);
    
    if (mainContent && toggleIcon) {
        const isExpanded = mainContent.classList.contains('expanded');
        
        if (!isExpanded) {
            document.querySelectorAll('.main-category-content').forEach(el => {
                if (el !== mainContent) el.classList.remove('expanded');
            });
            document.querySelectorAll('.main-category-toggle').forEach(el => {
                if (el !== toggleIcon) el.classList.remove('expanded');
            });
            
            mainContent.classList.add('expanded');
            toggleIcon.classList.add('expanded');
            
            if (!mainContent.classList.contains('main-category-direct')) {
                const firstSubcategory = mainContent.querySelector('.category-buttons');
                const firstToggle = mainContent.querySelector('.category-toggle');
                if (firstSubcategory && firstToggle) {
                    firstSubcategory.classList.add('expanded');
                    firstToggle.classList.add('expanded');
                }
            }
        } else {
            mainContent.classList.remove('expanded');
            toggleIcon.classList.remove('expanded');
        }
    }
}

function toggleCategory(categoryId) {
    const categoryButtons = document.getElementById(categoryId);
    const toggleIcon = document.querySelector(`[data-category="${categoryId}"] .category-toggle`);
    
    if (categoryButtons && toggleIcon) {
        const isExpanded = categoryButtons.classList.contains('expanded');
        
        if (!isExpanded) {
            const parentMainCategory = categoryButtons.closest('.main-category-content');
            if (parentMainCategory) {
                parentMainCategory.querySelectorAll('.category-buttons').forEach(el => {
                    if (el !== categoryButtons) el.classList.remove('expanded');
                });
                parentMainCategory.querySelectorAll('.category-toggle').forEach(el => {
                    if (el !== toggleIcon) el.classList.remove('expanded');
                });
            }
            
            categoryButtons.classList.add('expanded');
            toggleIcon.classList.add('expanded');
        } else {
            categoryButtons.classList.remove('expanded');
            toggleIcon.classList.remove('expanded');
        }
    }
}

// ========== AUTO-OPEN CATEGORIES BY PAGE ==========

function openCategoryForPage(page) {
    console.log('📂 Opening category for page:', page);
    
    const categoryMap = {
        'calculator': ['awsCategory', 'calculatorButtons'],
        'arm': ['awsCategory', 'calculatorButtons'],
        'grind': ['awsCategory', 'calculatorButtons'],
        'roulette': ['awsCategory', 'calculatorButtons'],
        'boss': ['awsCategory', 'calculatorButtons'],
        'boosts': ['awsCategory', 'infoButtons'],
        'shiny': ['awsCategory', 'infoButtons'],
        'secret': ['awsCategory', 'infoButtons'],
        'codes': ['awsCategory', 'infoButtons'],
        'aura': ['awsCategory', 'infoButtons'],
        'trainer': ['awsCategory', 'infoButtons'],
        'charms': ['awsCategory', 'infoButtons'],
        'worlds': ['awsCategory', 'infoButtons'],
        'help': ['systemCategory', null],
        'peoples': ['systemCategory', null]
    };
    
    const categories = categoryMap[page];
    if (!categories) {
        console.warn('⚠️ No category mapping for page:', page);
        return;
    }
    
    const [mainCategoryId, subCategoryId] = categories;
    
    document.querySelectorAll('.main-category-content').forEach(el => {
        el.classList.remove('expanded');
    });
    document.querySelectorAll('.main-category-toggle').forEach(el => {
        el.classList.remove('expanded');
    });
    document.querySelectorAll('.category-buttons').forEach(el => {
        el.classList.remove('expanded');
    });
    document.querySelectorAll('.category-toggle').forEach(el => {
        el.classList.remove('expanded');
    });
    
    const mainContent = document.getElementById(mainCategoryId);
    const mainToggle = document.querySelector(`[data-main-category="${mainCategoryId}"] .main-category-toggle`);
    
    if (mainContent && mainToggle) {
        mainContent.classList.add('expanded');
        mainToggle.classList.add('expanded');
        console.log('✅ Opened main category:', mainCategoryId);
    }
    
    if (subCategoryId) {
        const subContent = document.getElementById(subCategoryId);
        const subToggle = document.querySelector(`[data-category="${subCategoryId}"] .category-toggle`);
        
        if (subContent && subToggle) {
            subContent.classList.add('expanded');
            subToggle.classList.add('expanded');
            console.log('✅ Opened subcategory:', subCategoryId);
        }
    }
}

// ========== EVENT LISTENERS ==========

document.addEventListener('languageChanged', () => {
    console.log('🌍 Language changed');
});

// ========== PAGE CHANGE OBSERVER ==========

document.addEventListener('pageChanged', (e) => {
    if (e.detail && e.detail.page) {
        setTimeout(() => {
            openCategoryForPage(e.detail.page);
        }, 100);
    }
});

// ========== INITIALIZATION ==========

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadContent();
    });
} else {
    loadContent();
}

// Exports
Object.assign(window, { 
    toggleMainCategory,
    toggleCategory,
    openCategoryForPage,
    PAGE_ICONS
});

console.log('✅ Content Loader ready (CLEANED - No Menu Logic)');
