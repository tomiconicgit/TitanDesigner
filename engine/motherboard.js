// Import engine modules
import * as schema from './projectschema.js';
import * as renderer from './renderer.js';
import * as interactions from './interactions.js';

// Import all viewport initializers
import { initViewport } from '../viewport/viewport.js';
import { initViewportMenu } from '../viewport/viewportmenu.js';
import { initCustomisationToolbar } from '../viewport/customisationtoolbar.js';
import { initUiLibrary } from '../viewport/uilibrary.js';
import { initDeveloperTree } from '../viewport/developertree.js';
import { initViewportPage } from '../viewport/viewportpage.js';
import { initCodeEditor } from '../viewport/codeeditor.js';

/**
 * Main application router.
 */
async function route() {
    try {
        console.log('Initializing app container...');
        const appContainer = initViewportPage();
        if (!appContainer) {
            throw new Error('Failed to initialize app container');
        }

        console.log('Creating UI page...');
        const uiPage = document.createElement('div');
        uiPage.id = 'ui-page';
        appContainer.appendChild(uiPage);
        
        console.log('Creating repo page...');
        const repoPage = document.createElement('div');
        repoPage.id = 'repo-page';
        repoPage.classList.add('hidden');
        appContainer.appendChild(repoPage);

        // 1. Initialize the UI (Viewport and Panels)
        console.log('Initializing viewport...');
        initViewport(uiPage);
        if (!document.getElementById('iphone-frame')) {
            console.error('Viewport initialization failed: iphone-frame not found');
        }

        console.log('Initializing customisation toolbar...');
        initCustomisationToolbar();
        if (!document.getElementById('tools-panel')) {
            console.error('Customisation toolbar initialization failed: tools-panel not found');
        }

        console.log('Initializing UI library...');
        await initUiLibrary();
        if (!document.getElementById('ui-library-panel')) {
            console.error('UI library initialization failed: ui-library-panel not found');
        }

        console.log('Initializing code editor...');
        initCodeEditor();
        if (!document.getElementById('code-editor-panel')) {
            console.error('Code editor initialization failed: code-editor-panel not found');
        }

        // 2. Initialize the Developer Tree
        console.log('Initializing developer tree...');
        initDeveloperTree(repoPage);
        if (!document.querySelector('.developer-tree-panel')) {
            console.error('Developer tree initialization failed: developer-tree-panel not found');
        }

        // 3. Initialize the main menu
        console.log('Initializing viewport menu...');
        initViewportMenu(uiPage, repoPage);
        if (!document.getElementById('floating-bar')) {
            console.error('Viewport menu initialization failed: floating-bar not found');
        }

        // 4. Render the initial layout and activate interactions
        console.log('Rendering initial layout...');
        renderer.render();
        console.log('Initializing interactions...');
        interactions.initInteractions();

    } catch (error) {
        console.error('Error during application initialization:', error);
    }
}

// Initialize the application once the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, starting route...');
    route();
});