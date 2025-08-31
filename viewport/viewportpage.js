/**
 * Initializes the viewport page UI, setting up only the full-screen background, ignoring safe zones.
 */
export function initViewportPage() {
    const mainContainer = document.createElement('main');
    mainContainer.id = 'build-environment';
    mainContainer.style.width = '100%';
    mainContainer.style.height = '100%';
    mainContainer.style.position = 'absolute';
    mainContainer.style.top = '0';
    mainContainer.style.left = '0';
    mainContainer.style.backgroundColor = '#1e1e1e'; // Full-screen background for the page

    // Append the main container to the body
    document.body.appendChild(mainContainer);
}