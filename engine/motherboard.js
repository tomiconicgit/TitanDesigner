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

/**
 * Main application router.
 */
async function route() {
    try {
        console.log('Initializing app container...');
        const appContainer = initViewportPage();
        if (!appContainer) throw new Error('Failed to initialize app container');

        console.log('Initializing UI page...');
        const uiPage = document.createElement('div');
        uiPage.id = 'ui-page';
        appContainer.appendChild(uiPage);
        
        console.log('Initializing repo page...');
        const repoPage = document.createElement('div');
        repoPage.id = 'repo-page';
        repoPage.classList.add('hidden');
        appContainer.appendChild(repoPage);

        // 1. Initialize the UI (Viewport and Panels)
        console.log('Initializing viewport...');
        initViewport(uiPage);
        console.log('Initializing customisation toolbar...');
        initCustomisationToolbar();
        console.log('Initializing UI library...');
        await initUiLibrary();

        // 2. Initialize the Developer Tree
        console.log('Initializing developer tree...');
        initDeveloperTree(repoPage);

        // 3. Initialize the main menu
        console.log('Initializing viewport menu...');
        initViewportMenu(uiPage, repoPage);

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