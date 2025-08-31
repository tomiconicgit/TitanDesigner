/**
 * Initializes the viewport page UI, setting up the full-screen background with safe area support, removing top padding.
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
    mainContainer.style.top = '0'; // Remove top safe area inset
    mainContainer.style.left = 'env(safe-area-inset-left, 0px)'; // Respect left safe area
    mainContainer.style.backgroundColor = '#2E2E2E'; // Xcode-like dark grey background
    mainContainer.style.padding = '0 env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px)'; // Remove top padding, keep others

    // Append the main container to the body
    document.body.appendChild(mainContainer);
}