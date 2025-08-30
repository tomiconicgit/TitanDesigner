import { createCanvas } from './assets/canvasbuilder.js';

/**
 * Initializes the main build page UI.
 */
export function initBuildPage() {
    const mainContainer = document.getElementById('build-environment');
    if (!mainContainer) {
        console.error("Build environment not found.");
        return;
    }
    mainContainer.style.width = '100%';
    mainContainer.style.height = '100%';
    mainContainer.style.display = 'flex';
    mainContainer.style.flexDirection = 'column';
    mainContainer.style.backgroundColor = 'transparent'; // No additional background

    // Now, create the canvas inside the main container
    createCanvas(mainContainer);
}