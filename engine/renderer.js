import { layoutSchema } from './layoutSchema.js';
import { makeInteractive } from './interactions.js';

const canvas = document.getElementById('canvas');

export function render() {
    canvas.innerHTML = '';

    layoutSchema.forEach(component => {
        const element = document.createElement('div');
        element.id = component.id;
        element.className = `canvas-element ${component.type.toLowerCase()}-element`;
        
        if (component.type === 'Image') {
            element.textContent = component.props.text;
        } else {
            element.textContent = component.props.text || component.type;
        }
        
        element.style.position = 'absolute';
        element.style.left = `${component.props.x}px`;
        element.style.top = `${component.props.y}px`;
        element.style.width = `${component.props.width}px`;
        element.style.height = `${component.props.height}px`;
        element.style.borderRadius = `${component.props.borderRadius}px`;
        element.style.boxSizing = 'border-box'; 
        element.style.backgroundColor = component.props.backgroundColor;
        element.style.opacity = component.props.opacity;
        element.style.color = component.props.foregroundColor || '#ffffff';

        if (component.props.shadowEnabled) {
            const props = component.props;
            element.style.boxShadow = `${props.shadowOffsetX}px ${props.shadowOffsetY}px ${props.shadowBlur}px ${props.shadowColor}`;
        } else {
            element.style.boxShadow = 'none';
        }

        if (component.type === 'Text') {
            element.style.fontSize = component.props.font === 'title' ? '24px' : '16px';
            element.style.fontWeight = component.props.fontWeight;
        } else if (component.type === 'Button') {
            element.style.display = 'flex';
            element.style.alignItems = 'center';
            element.style.justifyContent = 'center';
            element.style.border = '1px solid #555';
            element.style.backgroundColor = '#007AFF';
        } else if (component.type === 'Image') {
            element.style.backgroundColor = '#555';
            element.style.display = 'flex';
            element.style.alignItems = 'center';
            element.style.justifyContent = 'center';
        }

        makeInteractive(element);
        canvas.appendChild(element);
    });
}