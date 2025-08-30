import { layoutSchema } from './layoutSchema.js';
import { makeInteractive } from './interactions.js';

const canvas = document.getElementById('canvas');

export function render() {
    canvas.innerHTML = '';

    layoutSchema.forEach(component => {
        const element = document.createElement('div');
        element.id = component.id;
        element.className = 'canvas-element';
        
        element.textContent = component.props.text || component.type;
        
        // Apply style properties from the schema
        element.style.position = 'absolute';
        element.style.left = `${component.props.x}px`;
        element.style.top = `${component.props.y}px`;
        element.style.width = `${component.props.width}px`;
        element.style.height = `${component.props.height}px`;
        element.style.borderRadius = `${component.props.borderRadius}px`;
        element.style.boxSizing = 'border-box'; 
        element.style.backgroundColor = component.props.backgroundColor;
        element.style.opacity = component.props.opacity;

        if (component.props.shadowEnabled) {
            const props = component.props;
            element.style.boxShadow = `${props.shadowOffsetX}px ${props.shadowOffsetY}px ${props.shadowBlur}px ${props.shadowColor}`;
        } else {
            element.style.boxShadow = 'none';
        }

        makeInteractive(element);

        canvas.appendChild(element);
    });
}