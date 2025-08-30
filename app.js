import { addComponent, generateId } from './engine/layoutSchema.js';
import { render } from './engine/renderer.js';

document.addEventListener('DOMContentLoaded', () => {
    // For demonstration, let's add one component to the canvas on load.
    // All toolbar-related logic has been removed.
    const initialComponent = {
        id: generateId(),
        type: 'Text',
        props: {
            text: 'Hello, Canvas!',
            x: 100, 
            y: 150,
        }
    };

    addComponent(initialComponent);
    render();
});
