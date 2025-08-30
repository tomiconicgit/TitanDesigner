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

    libraryPanel.addEventListener('dragstart', () => {
        libraryPanel.classList.remove('visible');
    });

    // --- Drag and Drop Logic (UPDATED) ---
    let draggedItem = null;

    components.forEach(component => {
        component.addEventListener('dragstart', (e) => {
            draggedItem = e.target;
        });
    });

    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedItem) return;

        const componentType = draggedItem.getAttribute('data-type');
        
        // Calculate drop position relative to the canvas
        const canvasRect = canvas.getBoundingClientRect();
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;

        // 1. Create a new component object for the schema.
        const newComponent = {
            id: generateId(),
            type: componentType,
            props: {
                text: `New ${componentType}`,
                x: x - 50, // Offset to center the drop
                y: y - 20,
            }
        };

        // 2. Add the component to the schema.
        addComponent(newComponent);

        // 3. Re-render the entire canvas from the updated schema.
        render();

        draggedItem = null;
    });
});
