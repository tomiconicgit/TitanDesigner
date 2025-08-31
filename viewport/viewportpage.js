/**
 * Initializes the viewport page UI, setting up the full-screen background with a fade into the top padding.
 */
export function initViewportPage() {
    if (!document.body) {
        console.error("Document body not available.");
        return;
    }
    const mainContainer = document.createElement('main');
    mainContainer.id = 'build-environment';
    mainContainer.style.width = '100%';
    mainContainer.style.height = '100dvh'; // Use dynamic viewport height
    mainContainer.style.position = 'absolute';
    mainContainer.style.top = '0'; // Start at top edge
    mainContainer.style.left = 'env(safe-area-inset-left, 0px)'; // Respect left safe area
    mainContainer.style.background = '#000000'; // New black background
    mainContainer.style.padding = '0 env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px)'; // No top padding

    // Append the main container to the body
    document.body.appendChild(mainContainer);
}