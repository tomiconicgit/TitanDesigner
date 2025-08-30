// Import all engine modules
import * as schema from './layoutschema.js';
import * as interactions from './interactions.js';
import * as renderer from './renderer.js';

// Import page initializers
import { initBuildPage } from '../buildpage/buildpage.js';
import { initLayoutToggle } from '../buildpage/assets/canvasbuilderlayouts.js';

/**
 * Main application router.
 * Determines which page to load based on URL or state.
 */
function route() {
    try {
        // 1. Initialize the primary page structure
        initBuildPage();

        // 2. Get a reference to the canvas now that it exists
        const canvas = document.getElementById('canvas');
        if (!canvas) {
            console.error("Canvas element not found after page initialization.");
            return;
        }

        // 3. Define and add the initial component to the schema
        const initialComponent = {
            id: schema.generateId(),
            type: 'Text',
            props: {
                text: 'Canvas Ready',
                x: 125,
                y: 150
            }
        };
        schema.addComponent(initialComponent);

        // 4. Render the initial component
        renderer.render();

        // 5. Initialize the layout toggle
        initLayoutToggle();
    } catch (error) {
        console.error("Error during route initialization:", error);
    }
}

// Initialize the application once the DOM is ready.
document.addEventListener('DOMContentLoaded', route);