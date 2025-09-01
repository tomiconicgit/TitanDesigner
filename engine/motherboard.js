// Import engine modules (these remain unchanged)
import * as schema from './layoutschema.js';
import * as renderer from './renderer.js';
import * as interactions from './interactions.js';

// Import NEW/MODIFIED viewport initializers
import { initViewportPage } from '../viewport/viewportpage.js';
import { initViewport } from '../viewport/viewport.js';
import { initViewportMenu } from '../viewport/viewportmenu.js';
import { initCustomisationToolbar } from '../viewport/customisationtoolbar.js';

/**
 * Main application router.
 * This function now builds the new UI structure.
 */
function route() {
    try {
        // 1. Initialize the main page background and centering container.
        const appContainer = initViewportPage();

        // 2. Initialize the iPhone silhouette and the canvas within it.
        initViewport(appContainer);

        // 3. Initialize the top "Menu" button and the slide-up "UI Library" panel.
        initViewportMenu(appContainer);
        
        // 4. Initialize the hidden context menu and the detailed customization panel.
        initCustomisationToolbar();

        // 5. Render any components currently in the schema (initially empty).
        renderer.render();

        // 6. Initialize interaction listeners on the newly created canvas.
        interactions.initInteractions();

    } catch (error) {
        console.error("Error during application initialization:", error);
    }
}

// Initialize the application once the DOM is ready.
document.addEventListener('DOMContentLoaded', route);
