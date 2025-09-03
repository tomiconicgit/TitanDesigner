// Import engine modules
import * as schema from './projectschema.js';
import * as renderer from './renderer.js';
import * as interactions from './interactions.js';

// Import all viewport initializers
import { initViewport } from '../viewport/viewport.js';
import { initViewportMenu } from '../viewport/viewportmenu.js';
import { initCustomisationToolbar } from '../viewport/customisationtoolbar.js';
import { initUiLibrary } from '../viewport/uilibrary.js';
import { initDeveloperTree } from '../viewport/developertree.js';
import { initViewportPage } from '../viewport/viewportpage.js';
import { initCodeEditor } from '../viewport/codeeditor.js';

/**
 * Main application router.
 */
async function route() {
    try {
        console.log('Initializing app container...');
        const appContainer = initViewportPage();
        if (!appContainer) {
            throw new Error('Failed to initialize app container');
        }
        console.log('App container initialized:', appContainer);

        console.log('Creating UI page...');
        const uiPage = document.createElement('div');
        uiPage.id = 'ui-page';
        appContainer.appendChild(uiPage);
        console.log('UI page created:', uiPage);

        console.log('Creating repo page...');
        const repoPage = document.createElement('div');
        repoPage.id = 'repo-page';
        repoPage.classList.add('hidden');
        appContainer.appendChild(repoPage);
        console.log('Repo page created:', repoPage);

        // 1. Initialize the UI (Viewport and Panels)
        console.log('Initializing viewport...');
        initViewport(uiPage);
        const iphoneFrame = document.getElementById('iphone-frame');
        if (!iphoneFrame) {
            console.error('Viewport initialization failed: iphone-frame not found');
        } else {
            console.log('Viewport initialized, iphone-frame found');
        }

        console.log('Initializing customisation toolbar...');
        initCustomisationToolbar();
        const toolsPanel = document.getElementById('tools-panel');
        if (!toolsPanel) {
            console.error('Customisation toolbar initialization failed: tools-panel not found');
        } else {
            console.log('Customisation toolbar initialized, tools-panel found');
        }

        console.log('Initializing UI library...');
        await initUiLibrary();
        const uiLibraryPanel = document.getElementById('ui-library-panel');
        if (!uiLibraryPanel) {
            console.error('UI library initialization failed: ui-library-panel not found');
        } else {
            console.log('UI library initialized, ui-library-panel found');
        }

        console.log('Initializing code editor...');
        initCodeEditor();
        const codeEditorPanel = document.getElementById('code-editor-panel');
        if (!codeEditorPanel) {
            console.error('Code editor initialization failed: code-editor-panel not found');
        } else {
            console.log('Code editor initialized, code-editor-panel found');
        }

        // 2. Initialize the Developer Tree
        console.log('Initializing developer tree...');
        initDeveloperTree(repoPage);
        const treePanel = document.querySelector('.developer-tree-panel');
        if (!treePanel) {
            console.error('Developer tree initialization failed: developer-tree-panel not found');
        } else {
            console.log('Developer tree initialized, developer-tree-panel found');
        }

        // 3. Initialize the main menu
        console.log('Initializing viewport menu...');
        initViewportMenu(uiPage, repoPage);
        const floatingBar = document.getElementById('floating-bar');
        if (!floatingBar) {
            console.error('Viewport menu initialization failed: floating-bar not found');
        } else {
            console.log('Viewport menu initialized, floating-bar found');
        }

        // 4. Render the initial layout and activate interactions
        console.log('Rendering initial layout...');
        renderer.render();
        console.log('Checking canvas content...');
        const canvas = document.getElementById('canvas');
        if (canvas && canvas.children.length === 0) {
            console.warn('Canvas is empty after rendering');
        } else {
            console.log('Canvas rendered with content:', canvas.children.length, 'elements');
        }

        console.log('Initializing interactions...');
        interactions.initInteractions();
        console.log('Interactions initialized');

    } catch (error) {
        console.error('Error during application initialization:', error);
    }
}

// Initialize the application once the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, starting route...');
    setTimeout(route, 0); // Ensure DOM is fully ready
});