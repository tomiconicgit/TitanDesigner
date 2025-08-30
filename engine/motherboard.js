// Import all engine modules
import * as schema from './layoutschema.js';
import * as interactions from './interactions.js';
import * as renderer from './renderer.js';

// Import page initializers
import { initBuildPage } from '../buildpage/buildpage.js';

/**
 * Main application router.
 * Determines which page to load based on URL or state.
 */
function route() {
    // 1. Initialize the primary page structure
    initBuildPage();

    // 2. Get a reference to the canvas now that it exists
    const canvas = document.getElementById('canvas');
    if (!canvas) {
        console.error("Canvas element not found after page initialization.");
        return;
    }

    // 3. Define and add the initial component to the schema
    // Note: Positioning is now more robust.
    const initialComponent = {
        id: schema.generateId(),
        type: 'Text',
        props: {
            text: 'Canvas Ready',
            x: 125, // Centered for a ~400px wide canvas
            y: 150
        }
    };
    schema.addComponent(initialComponent);

    // 4. Render the initial component
    renderer.render();
}

// Initialize the application once the DOM is ready.
document.addEventListener('DOMContentLoaded', route);
