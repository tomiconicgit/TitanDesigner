/**
 * Renderer module for rendering the hierarchical component tree onto the canvas.
 */
export function render() {
    const canvas = document.getElementById('canvas');
    if (!canvas) {
        console.error("Canvas not found for rendering.");
        return;
    }
    canvas.innerHTML = ''; // Clear existing content

    // Import the new getActiveViewLayout function
    import('./projectschema.js').then(({ getActiveViewLayout }) => {
        const layout = getActiveViewLayout();
        // Start rendering recursively from the layout's children
        if (layout && layout.children) {
            renderNodeChildren(layout, canvas);
        }
    });
}

/**
 * Recursively renders the children of a given component node.
 * @param {Object} parentNode The parent component from the schema.
 * @param {HTMLElement} parentElement The parent DOM element to append children to.
 */
function renderNodeChildren(parentNode, parentElement) {
    if (!parentNode.children) return;

    parentNode.children.forEach(component => {
        const element = createComponentElement(component);
        if (element) {
            parentElement.appendChild(element);
            // If the component has children, render them inside this new element
            renderNodeChildren(component, element);
        }
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
    element.className = `draggable ui-${component.type.toLowerCase().replace(' ', '')}`; // Handle 'Bottom Bar'
    element.style.position = 'absolute';
    element.style.left = `${component.props.x || 0}px`;
    element.style.top = `${component.props.y || 0}px`;
    element.style.width = component.props.width ? `${component.props.width}px` : null;
    element.style.height = component.props.height ? `${component.props.height}px` : null;
    element.style.zIndex = '10';

    // Apply specific styles from props
    if (component.props.fontSize) element.style.fontSize = `${component.props.fontSize}px`;
    if (component.props.color) element.style.color = component.props.color;
    if (component.props.backgroundColor) element.style.backgroundColor = component.props.backgroundColor;
    
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
