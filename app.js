import { addComponent, generateId } from './engine/layoutSchema.js';
import { render } from './engine/renderer.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const components = document.querySelectorAll('.component');
    const libraryPanel = document.getElementById('ui-library');
    const toolsPanel = document.getElementById('tools-panel');
    const leftToolbarToggle = document.getElementById('left-toolbar-toggle');

    // --- Panel and Toolbar Logic ---
    leftToolbarToggle.addEventListener('click', () => {
        libraryPanel.classList.toggle('visible');
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
        });
    });

    // ==================================================================
    // === THIS IS THE FIX TO THE SCROLLING PROBLEM ===
    // ==================================================================
    // This stops touch events inside the toolbars from bubbling up
    // and interfering with the canvas drag-and-drop listeners.
    const stopPropagation = (e) => e.stopPropagation();

    libraryPanel.addEventListener('touchstart', stopPropagation);
    toolsPanel.addEventListener('touchstart', stopPropagation);
    
    libraryPanel.addEventListener('touchmove', stopPropagation);
    toolsPanel.addEventListener('touchmove', stopPropagation);
    // ==================================================================
});
