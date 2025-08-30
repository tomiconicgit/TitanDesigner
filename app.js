import { addComponent, generateId } from './engine/layoutSchema.js';
import { render } from './engine/renderer.js';

document.addEventListener('DOMContentLoaded', () => {
    const libraryPanel = document.getElementById('ui-library');
    const leftToolbarToggle = document.getElementById('left-toolbar-toggle');
    const components = document.querySelectorAll('.component');
    let scrollPosition = 0;

    // --- Scroll Locking Functions ---
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
            // Close the panel and unlock scroll after adding a component
            libraryPanel.classList.remove('visible');
            unlockScroll();
        });
    });

    // --- Initial Canvas State ---
    // For demonstration, we will add a single component to the canvas on load.
    const initialComponent = {
        id: generateId(),
        type: 'Text',
        props: {
            text: 'Canvas Ready',
            x: 100, 
            y: 150,
        }
    };
    addComponent(initialComponent);
    render();
});
