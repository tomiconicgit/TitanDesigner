import { addComponent, generateId } from './engine/layoutSchema.js';
import { render } from './engine/renderer.js';

// Your original, robust scroll-locking functions
let scrollPosition = 0;
function lockScroll() {
    scrollPosition = window.pageYOffset;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
    document.body.classList.add('noscroll');
}

function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollPosition);
    document.body.classList.remove('noscroll');
}

document.addEventListener('DOMContentLoaded', () => {
    const components = document.querySelectorAll('.component');
    const libraryPanel = document.getElementById('ui-library');
    const leftToolbarToggle = document.getElementById('left-toolbar-toggle');

    // REMOVED all touchstart/touchmove listeners from here.
    // They were part of the problem. CSS now handles scrolling.

    // --- Panel and Toolbar Logic ---
    leftToolbarToggle.addEventListener('click', () => {
        const isVisible = libraryPanel.classList.toggle('visible');
        if (isVisible) {
            lockScroll();
        } else {
            unlockScroll();
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
            libraryPanel.classList.remove('visible');
            unlockScroll();
        });
    });
});
