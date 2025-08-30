import { addComponent, generateId } from './engine/layoutSchema.js';
import { render } from './engine/renderer.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const components = document.querySelectorAll('.component');
    const libraryPanel = document.getElementById('ui-library');
    const leftToolbarToggle = document.getElementById('left-toolbar-toggle');

    // --- Panel and Toolbar Logic ---
    leftToolbarToggle.addEventListener('click', () => {
        libraryPanel.classList.toggle('visible');
        // ADDED: Toggle the noscroll class on the body
        document.body.classList.toggle('noscroll');
    });

    // --- Tap-to-Add Component Logic ---
    components.forEach(component => {
        component.addEventListener('click', () => {
            const componentType = component.getAttribute('data-type');
            
            const newComponent = {
                id: generateId(),
                type: componentType,
                props: {
                    text: `New ${componentType}`,
                    x: 150, 
                    y: 200,
                }
            };

            addComponent(newComponent);
            render();
            libraryPanel.classList.remove('visible');
            // ADDED: Ensure noscroll is removed when panel closes
            document.body.classList.remove('noscroll');
        });
    });
});
