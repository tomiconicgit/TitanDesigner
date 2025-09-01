/**
 * Renderer module for rendering components onto the canvas.
 */
export function render() {
    const canvas = document.getElementById('canvas');
    if (!canvas) {
        console.error("Canvas not found for rendering.");
        return;
    }
    canvas.innerHTML = ''; // Clear existing content
    import('./layoutschema.js').then(({ getComponents }) => {
        getComponents().forEach(component => {
            const element = createComponentElement(component);
            if (element) {
                canvas.appendChild(element);
            }
        });
    });
}

/**
 * Creates a DOM element for a given component.
 * @param {Object} component The component object with id, type, and props.
 * @returns {HTMLElement} The created element.
 */
function createComponentElement(component) {
    let element = document.createElement('div');
    element.dataset.componentId = component.id;
    element.className = `draggable ui-${component.type.toLowerCase()}`;
    element.style.position = 'absolute';
    element.style.left = `${component.props.x || 0}px`;
    element.style.top = `${component.props.y || 0}px`;
    element.style.width = component.props.width ? `${component.props.width}px` : null;
    element.style.height = component.props.height ? `${component.props.height}px` : null;
    element.style.zIndex = '10';

    switch (component.type) {
        case 'Text':
            element.textContent = component.props.text || 'Text';
            element.style.width = 'auto';
            element.style.height = 'auto';
            break;
        case 'Button':
            element.textContent = component.props.text || 'Button';
            break;
        case 'Container':
        case 'Card':
        case 'Header':
        case 'Bottom Bar':
            element.textContent = component.props.text || '';
            break;
        case 'Input':
            element.innerHTML = `<input type="text" placeholder="${component.props.placeholder || 'Placeholder'}" readonly>`;
            break;
        case 'Image':
        case 'Avatar':
            element.innerHTML = `<img src="${component.props.src || 'https://via.placeholder.com/150'}" alt="placeholder">`;
            break;
        case 'Icon':
             element.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>`;
             break;
        default:
            console.warn(`Unsupported component type: ${component.type}`);
            return null;
    }
    return element;
}
