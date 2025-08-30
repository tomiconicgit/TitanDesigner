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
                    // Add default properties for specific component types
                    ...(type === 'Button' ? { buttonStyle: 'borderedProminent', borderShape: 'capsule' } : {}),
                    ...(type === 'Image' ? { systemName: 'photo' } : {}),
                }
            };
            addComponent(newComponent);
            render();
        });

        // Add touch support for mobile
        button.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent default touch behaviors
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

    // Add touch support for toggle on mobile
    toolbarToggle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        toolbarPanel.classList.toggle('active');
    }, { passive: false });

    // Optional: Close panel when tapping outside (mobile-friendly)
    document.addEventListener('touchstart', (e) => {
        if (!toolbarPanel.contains(e.target) && !toolbarToggle.contains(e.target) && toolbarPanel.classList.contains('active')) {
            toolbarPanel.classList.remove('active');
        }
    });
});