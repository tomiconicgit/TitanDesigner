import { addComponent, generateId } from './engine/layoutSchema.js';
import { render } from './engine/renderer.js';

let scrollPosition = 0;

// Function to lock body scroll
function lockScroll() {
    scrollPosition = window.pageYOffset;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
    document.body.classList.add('noscroll');
}

// Function to unlock body scroll
function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollPosition);
    document.body.classList.remove('noscroll');
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const components = document.querySelectorAll('.component');
    const libraryPanel = document.getElementById('ui-library');
    const leftToolbarToggle = document.getElementById('left-toolbar-toggle');

    // Stop touchmove propagation on ui-library to prevent background scrolling
    libraryPanel.addEventListener('touchmove', (e) => {
        e.stopPropagation();
    }, { passive: false });

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
            // Close the panel and remove the noscroll class after adding a component
            libraryPanel.classList.remove('visible');
            unlockScroll();
        });
    });
});