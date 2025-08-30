import { createCanvas } from './assets/canvasbuilder.js';

/**
 * Initializes the main build page UI.
 */
export function initBuildPage() {
    const mainContainer = document.createElement('main');
    mainContainer.id = 'build-environment';
    mainContainer.style.width = '100vw';
    mainContainer.style.height = '100vh';
    mainContainer.style.display = 'flex';
    mainContainer.style.flexDirection = 'column';

    // Append the main container to the body
    document.body.appendChild(mainContainer);

    // Now, create the canvas inside the main container
    createCanvas(mainContainer);
}
