import { addComponent, generateId } from './layoutSchema.js';
import { render } from './renderer.js';
import { createCanvas } from '../assets/canvasbuilder.js'; // <-- Path updated

document.addEventListener('DOMContentLoaded', () => {
    const mainElement = document.querySelector('main');
    createCanvas(mainElement); 

    const canvas = document.getElementById('canvas');

    // Function to center the initial component
    function getInitialPosition() {
        const canvasRect = canvas.getBoundingClientRect();
        const componentWidth = 120; // Default width from layoutSchema
        const componentHeight = 50; // Default height
        return {
            x: (canvasRect.width - componentWidth) / 2,
            y: (canvasRect.height / 3) // Place it a third of the way down
        };
    }

    const initialPosition = getInitialPosition();

    // Initialize with a single text component
    const initialComponent = {
        id: generateId(),
        type: 'Text',
        props: {
            text: 'Canvas Ready',
            x: initialPosition.x,
            y: initialPosition.y,
        }
    };

    addComponent(initialComponent);
    render();

    // Simplified resize handling
    function handleResize() {
        render();
    }

    window.addEventListener('resize', handleResize);
    if ('visualViewport' in window) {
        visualViewport.addEventListener('resize', handleResize);
    }

    // Toolbar button event listeners
    const toolbarButtons = document.querySelectorAll('.toolbar-button');
    toolbarButtons.forEach(button => {
        const addElement = () => {
            const type = button.dataset.type;
            const newComponent = {
                id: generateId(),
                type: type,
                props: {
                    x: 50,
                    y: 50,
                    text: type === 'Text'? 'New Text' : type === 'Button'? 'New Button' : 'Image Placeholder',
                }
            };
            addComponent(newComponent);
            render();
        };

        button.addEventListener('click', addElement);
        button.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevents ghost click
            addElement();
        }, { passive: false });
    });

    // Toolbar toggle event listener
    const toolbarToggle = document.getElementById('toolbar-toggle');
    const toolbarPanel = document.getElementById('toolbar-panel');

    const toggleToolbar = () => {
        toolbarPanel.classList.toggle('active');
    };

    toolbarToggle.addEventListener('click', toggleToolbar);
    toolbarToggle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        toggleToolbar();
    }, { passive: false });

    // Close toolbar when clicking outside
    document.addEventListener('click', (e) => {
        if (!toolbarPanel.contains(e.target) &&!toolbarToggle.contains(e.target) && toolbarPanel.classList.contains('active')) {
            toolbarPanel.classList.remove('active');
        }
    });
});
