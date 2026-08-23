// Theme Manager — dark / light only, driven by [data-theme] on <html>
let colorsInitialized = false;

const colorThemes = {
    dark: {
        name: { en: 'Dark', uk: 'Темна', ru: 'Тёмная' },
        icon: '🌙'
    },
    light: {
        name: { en: 'Light', uk: 'Світла', ru: 'Светлая' },
        icon: '☀️'
    }
};

function getCurrentColorTheme() {
    const saved = localStorage.getItem('armHelper_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark';
}

function saveColorTheme(theme) {
    localStorage.setItem('armHelper_theme', theme);
}

function applyColorTheme(themeName) {
    const theme = colorThemes[themeName] ? themeName : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggleUI();
    console.log('✅ Applied theme:', theme);
}

function changeColorTheme(themeName) {
    if (!colorThemes[themeName]) return;
    saveColorTheme(themeName);
    applyColorTheme(themeName);
    document.dispatchEvent(new CustomEvent('colorThemeChanged', { detail: { theme: themeName } }));
}

function toggleColorTheme() {
    const next = getCurrentColorTheme() === 'dark' ? 'light' : 'dark';
    changeColorTheme(next);
}

function updateThemeToggleUI() {
    const current = getCurrentColorTheme();
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        const next = current === 'dark' ? 'light' : 'dark';
        btn.textContent = colorThemes[next].icon;
        btn.title = colorThemes[next].name.en;
    });
}

function initializeColorsOnStart() {
    applyColorTheme(getCurrentColorTheme());
    colorsInitialized = true;
}

// Apply as early as possible to avoid a flash
initializeColorsOnStart();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateThemeToggleUI);
}

// Global exports
window.colorThemes = colorThemes;
window.getCurrentColorTheme = getCurrentColorTheme;
window.saveColorTheme = saveColorTheme;
window.applyColorTheme = applyColorTheme;
window.changeColorTheme = changeColorTheme;
window.toggleColorTheme = toggleColorTheme;
window.updateThemeToggleUI = updateThemeToggleUI;
window.initializeColors = initializeColorsOnStart;

console.log('✅ colors.js loaded (dark/light)');
