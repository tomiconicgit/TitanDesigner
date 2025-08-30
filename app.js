// Import the functions we need from our new engine files
import { addComponent, generateId } from './engine/layoutSchema.js';
import { render } from './engine/renderer.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const components = document.querySelectorAll('.component');
    const libraryPanel = document.getElementById('ui-library');
    const leftToolbarToggle = document.getElementById('left-toolbar-toggle');

    // --- Panel and Toolbar Logic (Unchanged) ---
    leftToolbarToggle.addEventListener('click', () => {
        libraryPanel.classList.toggle('visible');
    });

    // --- Tap-to-Add Component Logic (NEW) ---
    components.forEach(component => {
        component.addEventListener('click', () => {
            const componentType = component.getAttribute('data-type');
            
            // 1. Create a new component object for the schema.
            const newComponent = {
                id: generateId(),
                type: componentType,
                props: {
                    text: `New ${componentType}`,
                    // Add it to the center of the canvas view
                    x: 150, 
                    y: 200,
                }
            };

            // 2. Add the component to the schema.
            addComponent(newComponent);

            // 3. Re-render the entire canvas.
            render();
            
            // 4. Close the panel for a better UX.
            libraryPanel.classList.remove('visible');
        });
    });

    // --- All old drag-and-drop listeners have been removed ---
});
