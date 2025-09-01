import * as schema from '../engine/layoutschema.js';
import { render } from '../engine/renderer.js';

// A list of all available component types. The names must match the file names in /viewport/components/
const componentTypes = [
    'Header', 'Text', 'Button', 'Container', 'Card', 'Input', 'Image', 'Avatar', 'Icon', 'Bottom Bar'
];

/**
 * Initializes the UI Library panel.
 */
export async function initUiLibrary() {
    const uiLibraryPanel = document.createElement('div');
    uiLibraryPanel.id = 'ui-library-panel';
    uiLibraryPanel.className = 'panel hidden'; // Start hidden

    let componentButtonsHTML = '';

    // Dynamically import each component's template and create a button for it
    for (const type of componentTypes) {
        const fileName = type.toLowerCase().replace(' ', ''); // e.g., 'Bottom Bar' -> 'bottombar'
        try {
            // The 'await' here ensures we process one component before moving to the next
            const module = await import(`./components/${fileName}.js`);
            if (module.createComponentTemplate) {
                componentButtonsHTML += `<button class="component-add-btn" data-component-type="${type}">${type}</button>`;
            }
        } catch (error) {
            console.warn(`Could not load component module for: ${type}`, error);
        }
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

    // Listener for the main close button
    uiLibraryPanel.querySelector('.close-btn').addEventListener('click', () => {
        uiLibraryPanel.classList.add('hidden');
    });

    // Use event delegation for all component buttons
    uiLibraryPanel.addEventListener('click', async (e) => {
        if (e.target.matches('.component-add-btn')) {
            const type = e.target.dataset.componentType;
            const fileName = type.toLowerCase().replace(' ', '');
            
            try {
                const module = await import(`./components/${fileName}.js`);
                const newComponent = module.createComponentTemplate();
                newComponent.id = schema.generateId(); // Assign a unique ID

                schema.addComponent(newComponent); // Add to the schema
                render(); // Re-render the canvas
                
                uiLibraryPanel.classList.add('hidden'); // Hide panel after adding
            } catch (error) {
                console.error(`Failed to create component of type: ${type}`, error);
            }
        }
    });
}
