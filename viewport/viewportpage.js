/**
 * Initializes the main application page UI, creating a central container
 * for the viewport and menus.
 */
export function initViewportPage() {
    if (!document.body) {
        console.error("Document body not available.");
        return null;
    }
    document.body.style.background = '#141314';

    const appContainer = document.createElement('div');
    appContainer.id = 'app-container';
    appContainer.style.display = 'flex';
    appContainer.style.flexDirection = 'column';
    appContainer.style.alignItems = 'center';
    appContainer.style.justifyContent = 'center';
    appContainer.style.width = '100%';
    appContainer.style.height = '100dvh';
    appContainer.style.gap = '20px';
    appContainer.style.padding = '20px';
    appContainer.style.boxSizing = 'border-box';

    document.body.appendChild(appContainer);
    return appContainer;
}
