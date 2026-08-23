function createScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve(src);
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        script.onload = () => resolve(src);
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
    });
}

async function loadSystemScripts() {
    try {
        // System page modules (help, peoples)
        await Promise.all([
            'system/moderation/help.js',
            'system/moderation/peoples.js'
        ].map(createScript));

        // Menu Manager
        await createScript('system/moderation/menu_manager.js');

        // AWS system
        await createScript('AWS/system/aws_utils.js');
        await createScript('AWS/system/aws_router.js');
        await createScript('AWS/system/aws_loader.js');

        // System Content Loader
        await createScript('system/system_content/system_content.js');

        // Content loader (AWS + System)
        await createScript('system/content_loader.js');

        initializeSystems();
    } catch (error) {
        console.error('❌ Critical error:', error);
        initializeSystems();
    }
}

async function initializeSystems() {
    try {
        if (typeof loadAllAWSModules === 'function') {
            await loadAllAWSModules();
        }

        if (typeof initURLRouting === 'function') {
            initURLRouting();
        }

        console.log('✅ Systems ready');
    } catch (error) {
        console.error('❌ Initialization error:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let attempts = 0;
    const maxAttempts = 50;

    function waitForCriticalScripts() {
        const criticalFunctions = ['initializeApp', 'switchPage', 'getCurrentAppLanguage'];
        const allLoaded = criticalFunctions.every(fn => typeof window[fn] === 'function');

        if (allLoaded) {
            loadSystemScripts();
        } else if (attempts >= maxAttempts) {
            console.error('❌ Critical scripts timeout');
        } else {
            attempts++;
            setTimeout(waitForCriticalScripts, 100);
        }
    }

    waitForCriticalScripts();
});

console.log('✅ System Loader ready');
