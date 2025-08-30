import { addComponent, generateId } from './engine/layoutSchema.js';
import { render } from './engine/renderer.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const components = document.querySelectorAll('.component');
    const libraryPanel = document.getElementById('ui-library');
    const leftToolbarToggle = document.getElementById('left-toolbar-toggle');

    // --- Panel and Toolbar Logic ---
    leftToolbarToggle.addEventListener('click', () => {
        const isVisible = libraryPanel.classList.toggle('visible');
        if (isVisible) {
            document.body.classList.add('noscroll');
        } else {
            document.body.classList.remove('noscroll');
        }
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
            // Close the panel and remove the noscroll class after adding a component
            libraryPanel.classList.remove('visible');
            document.body.classList.remove('noscroll');
        });
    });
});