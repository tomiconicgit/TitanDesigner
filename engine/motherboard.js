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

/**
 * Main application router.
 */
async function route() {
    try {
        const uiPage = document.createElement('div');
        uiPage.id = 'ui-page';
        document.body.appendChild(uiPage);
        
        const repoPage = document.createElement('div');
        repoPage.id = 'repo-page';
        repoPage.classList.add('hidden'); // Initially hidden
        document.body.appendChild(repoPage);

        // 1. Initialize the UI (Viewport and Panels)
        initViewport(uiPage);
        initCustomisationToolbar();
        await initUiLibrary();

        // 2. Initialize the Developer Tree
        initDeveloperTree(repoPage);

        // 3. Initialize the main menu
        initViewportMenu(uiPage, repoPage);

        // 4. Render the initial layout and activate interactions
        renderer.render();
        interactions.initInteractions();

    } catch (error) {
        console.error("Error during application initialization:", error);
    }
}

// Initialize the application once the DOM is ready.
document.addEventListener('DOMContentLoaded', route);
