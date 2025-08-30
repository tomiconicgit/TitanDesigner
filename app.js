import { addComponent, generateId } from './engine/layoutSchema.js';
import { render } from './engine/renderer.js';

document.addEventListener('DOMContentLoaded', () => {
    // All toolbar and panel logic has been removed.
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
