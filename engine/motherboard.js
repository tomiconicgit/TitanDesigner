// Import all engine modules
import * as schema from './layoutschema.js';
import * as interactions from './interactions.js';
import * as renderer from './renderer.js';

// Import viewport initializers
import { initViewportPage } from '../viewport/viewportpage.js';
import { createCanvas, updateAspectRatio, updateOrientation, updateColourScheme, updateDynamicType, updatePreviewMode } from '../viewport/viewport.js';
import { initViewportLayouts } from '../viewport/viewportmenu.js'; // Updated import
import { initCustomisationToolbar } from '../viewport/customisationtoolbar.js';

/**
 * Main application router.
 * Determines which page to load based on URL or state.
 */
function route() {
    try {
        // 1. Initialize the primary viewport page background
        initViewportPage();

        // 2. Create the canvas inside the build environment
        const buildEnvironment = document.getElementById('build-environment');
        if (!buildEnvironment) {
            console.error("Build environment not found.");
            return;
        }
        createCanvas(buildEnvironment);

        // 3. Get a reference to the canvas now that it exists
        const canvas = document.getElementById('canvas');
        if (!canvas) {
            console.error("Canvas element not found after creation.");
            return;
        }

        // 4. Initialize toolbars
        initCustomisationToolbar();

        // 5. Define and add the initial component to the schema
        const initialComponent = {
            id: schema.generateId(),
            type: 'Text',
            props: {
                text: 'Canvas Ready',
                x: 170, // Centred horizontally in 340px canvas
                y: 466  // Centred vertically in 932px aspect ratio, scaled to canvas height
            }
        };
        schema.addComponent(initialComponent);

        // 6. Render the initial component
        renderer.render();

        // 7. Initialize the viewport menu panel (Xcode-like controls)
        initViewportLayouts();

        // 8. Initialize interactions
        interactions.initInteractions();
    } catch (error) {
        console.error("Error during route initialization:", error);
    }
}

// Initialize the application once the DOM is ready.
document.addEventListener('DOMContentLoaded', route);