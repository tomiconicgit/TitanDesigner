// Import engine modules
import * as schema from './layoutschema.js';
import * as renderer from './renderer.js';
import * as interactions from './interactions.js';

// Import all viewport initializers
import { initViewportPage } from '../viewport/viewportpage.js';
import { initViewport } from '../viewport/viewport.js';
import { initViewportMenu } from '../viewport/viewportmenu.js';
import { initCustomisationToolbar } from '../viewport/customisationtoolbar.js';
import { initUiLibrary } from '../viewport/uilibrary.js'; // <-- ADDED

/**
 * Main application router.
 */
async function route() { // <-- MADE ASYNC
    try {
        // 1. Initialize the main page and viewport
        const appContainer = initViewportPage();
        initViewport(appContainer);

        // 2. Initialize all UI panels and menus
        initViewportMenu(); // Note: appContainer not needed here
        initCustomisationToolbar();
        await initUiLibrary(); // <-- ADDED: Loads the UI component library

        // 3. Render the initial layout
        renderer.render();

        // 4. Activate drag-and-drop and tap interactions
        interactions.initInteractions();

    } catch (error) {
        console.error("Error during application initialization:", error);
    }
}

// Initialize the application once the DOM is ready.
document.addEventListener('DOMContentLoaded', route);
