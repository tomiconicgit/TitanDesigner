import { layoutSchema } from './layoutSchema.js';
import { makeDraggable } from './interactions.js';

const canvas = document.getElementById('canvas');

export function render() {
    // 1. Clear the canvas completely.
    canvas.innerHTML = '';

    // 2. Loop through the schema and create an element for each component.
    layoutSchema.forEach(component => {
        const element = document.createElement('div');
        element.id = component.id;
        element.className = 'canvas-element';
        element.textContent = component.props.text || component.type; // Use text prop or type as fallback.
        
        // Apply styles from the schema's props.
        element.style.position = 'absolute';
        element.style.left = `${component.props.x}px`;
        element.style.top = `${component.props.y}px`;

        // Make the new element interactive.
        makeDraggable(element);

        // 3. Add the new element to the canvas.
        canvas.appendChild(element);
    });
}
