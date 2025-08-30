// This module is responsible for turning the layoutSchema into a visible UI.
import { layoutSchema } from './layoutschema.js';

/**
 * Renders all components from the layoutSchema onto the canvas.
 */
export function render() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    // Clear the canvas before rendering
    canvas.innerHTML = '';

    // Loop through each component in the schema and create a DOM element for it
    layoutSchema.forEach(component => {
        const element = document.createElement('div');
        element.id = component.id;
        element.textContent = component.props.text || component.type;

        // Apply basic styles for positioning and appearance
        element.style.position = 'absolute';
        element.style.left = `${component.props.x}px`;
        element.style.top = `${component.props.y}px`;
        element.style.width = '150px';
        element.style.padding = '10px';
        element.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        element.style.color = 'white';
        element.style.borderRadius = '8px';
        element.style.textAlign = 'center';
        element.style.boxSizing = 'border-box';

        canvas.appendChild(element);
    });
}