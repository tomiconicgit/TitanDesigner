import * as schema from '../engine/layoutschema.js';
import { render } from '../engine/renderer.js';

// NEW: All styles for this panel are now self-contained in this file.
const panelStyles = `
    #ui-library-panel {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        background: rgba(28, 28, 30, 0.8);
        border-top: 1px solid rgba(80, 80, 80, 0.6);
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40%;
        z-index: 7000;
        transform: translateY(100%);
        transition: transform 0.3s ease-in-out;
        color: white;
        display: flex;
        flex-direction: column;
    }

    #ui-library-panel:not(.hidden) {
        transform: translateY(0);
    }
    
    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        border-bottom: 1px solid rgba(80, 80, 80, 0.6);
    }

    .panel-header h3 {
        margin: 0;
        font-weight: 500;
    }

    .close-btn {
        background: #444;
        border: none;
        color: #eee;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
    }

    .panel-content {
        padding: 20px;
        overflow-y: auto;
    }
    
    .component-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 15px;
    }

    .component-add-btn {
        background-color: #3a3a3c;
        border: none;
        color: white;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        text-align: center;
        font-size: 14px;
        transition: background-color 0.2s ease;
    }

    .component-add-btn:hover {
        background-color: #555;
    }
`;

// A list of all available component types.
const componentTypes = [
    'Header', 'Text', 'Button', 'Container', 'Card', 'Input', 'Image', 'Avatar', 'Icon', 'Bottom Bar'
];

/**
 * Initializes the UI Library panel.
 */
export async function initUiLibrary() {
    // Add the panel's styles to the document's head
    const styleElement = document.createElement('style');
    styleElement.textContent = panelStyles;
    document.head.appendChild(styleElement);

    const uiLibraryPanel = document.createElement('div');
    uiLibraryPanel.id = 'ui-library-panel';
    uiLibraryPanel.className = 'hidden'; // Start hidden

    let componentButtonsHTML = '';
    for (const type of componentTypes) {
        const fileName = type.toLowerCase().replace(' ', '');
        componentButtonsHTML += `<button class="component-add-btn" data-component-type="${type}">${type}</button>`;
    }

    uiLibraryPanel.innerHTML = `
        <div class="panel-header">
            <h3>UI Library</h3>
            <button class="close-btn">×</button>
        </div>
        <div class="panel-content component-grid">
            ${componentButtonsHTML}
        </div>
    `;
    document.body.appendChild(uiLibraryPanel);

    // --- Add Event Listeners ---
    uiLibraryPanel.querySelector('.close-btn').addEventListener('click', () => {
        uiLibraryPanel.classList.add('hidden');
    });

    uiLibraryPanel.addEventListener('click', async (e) => {
        if (e.target.matches('.component-add-btn')) {
            const type = e.target.dataset.componentType;
            const fileName = type.toLowerCase().replace(' ', '');
            try {
                const module = await import(`./components/${fileName}.js`);
                const newComponent = module.createComponentTemplate();
                newComponent.id = schema.generateId();
                schema.addComponent(newComponent);
                render();
                uiLibraryPanel.classList.add('hidden');
            } catch (error) {
                console.error(`Failed to create component of type: ${type}`, error);
            }
        }
    });
}

