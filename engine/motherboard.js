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
    // For now, we only have one page, so we'll always load the build page.
    // In the future, this function could check window.location.pathname
    // to decide which page to render.
    initBuildPage();
}

// Initialize the application once the DOM is ready.
document.addEventListener('DOMContentLoaded', route);
