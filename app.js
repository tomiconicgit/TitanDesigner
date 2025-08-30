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

    // --- SCROLLING BUG FIX ---
    // This is the definitive fix for the scrolling issue on mobile.
    // We identify the elements that need to be scrollable.
    const scrollableElements = document.querySelectorAll('#ui-library, .tools-content');

    // For each scrollable element, we attach a touchstart and mousedown listener.
    scrollableElements.forEach(el => {
        const stopEvent = (e) => {
            // stopPropagation() prevents the event from bubbling up to the document,
            // where our global drag-and-drop listener would otherwise hijack it.
            e.stopPropagation();
        };
        
        // This prevents the canvas drag logic from firing when starting a touch on a scrollable area.
        el.addEventListener('touchstart', stopEvent, { passive: true });
        
        // We add this for mousedown as well to ensure consistent behavior on desktop.
        el.addEventListener('mousedown', stopEvent);
    });
});
