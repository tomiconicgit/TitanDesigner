/**
 * Renderer module for rendering components onto the canvas.
 */
export function render() {
    const canvas = document.getElementById('canvas');
    if (!canvas) {
        console.error("Canvas not found for rendering.");
        return;
    }

    // Clear existing content
    canvas.innerHTML = '';

    // Fetch components from schema
    import('./layoutschema.js').then(({ getComponents }) => {
        const components = getComponents();
        if (!components || components.length === 0) {
            console.warn("No components found to render.");
            return;
        }
        components.forEach(component => {
            const element = createComponentElement(component);
            if (element) {
                canvas.appendChild(element);
            }
        });
    }).catch(error => {
        console.error("Error loading components:", error);
    });
}

/**
 * Creates a DOM element for a given component.
 * @param {Object} component The component object with id, type, and props.
 * @returns {HTMLElement} The created element or null if type is unsupported.
 */
function createComponentElement(component) {
    let element;
    switch (component.type) {
        case 'Text':
            element = document.createElement('div');
            element.style.position = 'absolute';
            element.style.left = `${component.props.x}px`;
            element.style.top = `${component.props.y}px`;
            element.style.colour = component.props.colour || '#ffffff';
            element.style.fontSize = getDynamicFontSize(component.props.fontSize);
            element.style.zIndex = '10';
            element.contentEditable = true; // Allow text editing
            element.textContent = component.props.text || 'Unnamed Text';
            element.addEventListener('input', (e) => updateComponentText(component.id, e.target.textContent));
            break;
        case 'Image':
            element = document.createElement('img');
            element.style.position = 'absolute';
            element.style.left = `${component.props.x}px`;
            element.style.top = `${component.props.y}px`;
            element.style.width = `${component.props.width}px` || '100px';
            element.style.height = `${component.props.height}px` || '100px';
            element.src = component.props.src || 'https://via.placeholder.com/100';
            element.style.zIndex = '10';
            break;
        case 'Button':
            element = document.createElement('button');
            element.style.position = 'absolute';
            element.style.left = `${component.props.x}px`;
            element.style.top = `${component.props.y}px`;
            element.style.width = `${component.props.width}px` || '100px';
            element.style.height = `${component.props.height}px` || '40px';
            element.textContent = component.props.text || 'Button';
            element.style.zIndex = '10';
            element.addEventListener('click', () => console.log(`Button ${component.id} clicked`)); // Placeholder action
            break;
        case 'Header':
            element = document.createElement('div');
            element.style.position = 'absolute';
            element.style.left = `${component.props.x}px`;
            element.style.top = `${component.props.y}px`;
            element.style.width = `${component.props.width}px` || '340px';
            element.style.height = `${component.props.height}px` || '60px';
            element.style.colour = component.props.colour || '#ffffff';
            element.style.backgroundColour = component.props.backgroundColour || '#333';
            element.style.zIndex = '10';
            element.textContent = component.props.text || 'New Header';
            break;
        default:
            console.warn(`Unsupported component type: ${component.type}`);
            return null;
    }
    element.dataset.componentId = component.id;
    return element;
}

/**
 * Gets the font size based on the dynamic type setting or component prop.
 * @param {string} [fontSize] Optional font size from component props.
 * @returns {string} The font size in em units.
 */
function getDynamicFontSize(fontSize) {
    const canvas = document.getElementById('canvas');
    if (canvas && canvas.classList.contains('large-text')) {
        return fontSize || '1.2em';
    }
    return fontSize || '1em';
}

/**
 * Updates the text content of a component in the schema.
 * @param {string} id The component ID.
 * @param {string} text The new text content.
 */
function updateComponentText(id, text) {
    import('./layoutschema.js').then(({ getComponents, updateComponent }) => {
        const components = getComponents();
        const component = components.find(c => c.id === id);
        if (component && component.type === 'Text') {
            component.props.text = text;
            updateComponent(component);
            render(); // Re-render to reflect changes
        }
    });
}

/**
 * Updates the rendering when the canvas state changes.
 */
export function updateRender() {
    render();
}

// Export for external triggering
export default { render, updateRender };