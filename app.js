import { addComponent, generateId } from './engine/layoutSchema.js';
import { render } from './engine/renderer.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize with a single text component
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

    // Dynamically adjust canvas size based on visual viewport
    function adjustCanvasSize() {
        const canvasContainer = document.getElementById('canvas-container');
        const toggleHeight = 40; // Approximate height of toggle button + padding
        const vh = 'visualViewport' in window ? visualViewport.height : window.innerHeight;

        // Set canvas to fit visual viewport, accounting for toggle
        document.body.style.height = `${vh}px`; // Force body to match viewport
        canvasContainer.style.height = `${vh - toggleHeight}px`;
        canvasContainer.style.width = '100vw';

        // Ensure canvas elements stay within bounds
        render(); // Re-render to adjust component positions
    }

    // Adjust on load, resize, and viewport changes
    adjustCanvasSize();
    window.addEventListener('resize', adjustCanvasSize);
    window.addEventListener('orientationchange', adjustCanvasSize);
    if ('visualViewport' in window) {
        visualViewport.addEventListener('resize', adjustCanvasSize); // Handle dynamic changes (e.g., keyboard, dynamic island)
    }

    // Toolbar button event listeners
    const toolbarButtons = document.querySelectorAll('.toolbar-button');
    toolbarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            const newComponent = {
                id: generateId(),
                type: type,
                props: {
                    x: 50,
                    y: 50,
                    text: type === 'Text' ? 'New Text' : type === 'Button' ? 'New Button' : 'Image Placeholder',
                    ...(type === 'Button' ? { buttonStyle: 'borderedProminent', borderShape: 'capsule' } : {}),
                    ...(type === 'Image' ? { systemName: 'photo' } : {}),
                }
            };
            addComponent(newComponent);
            render();
        });

        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const type = button.dataset.type;
            const newComponent = {
                id: generateId(),
                type: type,
                props: {
                    x: 50,
                    y: 50,
                    text: type === 'Text' ? 'New Text' : type === 'Button' ? 'New Button' : 'Image Placeholder',
                    ...(type === 'Button' ? { buttonStyle: 'borderedProminent', borderShape: 'capsule' } : {}),
                    ...(type === 'Image' ? { systemName: 'photo' } : {}),
                }
            };
            addComponent(newComponent);
            render();
        }, { passive: false });
    });

    // Toolbar toggle event listener
    const toolbarToggle = document.getElementById('toolbar-toggle');
    const toolbarPanel = document.getElementById('toolbar-panel');

    toolbarToggle.addEventListener('click', () => {
        toolbarPanel.classList.toggle('active');
    });

    toolbarToggle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        toolbarPanel.classList.toggle('active');
    }, { passive: false });

    document.addEventListener('touchstart', (e) => {
        if (!toolbarPanel.contains(e.target) && !toolbarToggle.contains(e.target) && toolbarPanel.classList.contains('active')) {
            toolbarPanel.classList.remove('active');
        }
    });
});