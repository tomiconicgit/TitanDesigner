/**
 * Initializes the viewport page UI, setting up only the full-screen background.
 */
export function initViewportPage() {
    const mainContainer = document.createElement('main');
    mainContainer.id = 'build-environment';
    mainContainer.style.width = '100vw';
    mainContainer.style.height = '100vh';
    mainContainer.style.backgroundColor = '#1e1e1e'; // Full-screen background for the page

    // Append the main container to the body
    document.body.appendChild(mainContainer);
}