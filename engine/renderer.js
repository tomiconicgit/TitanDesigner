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
            element.style.color = component.props.color || '#ffffff';
            element.style.fontSize = getDynamicFontSize();
            element.style.zIndex = '10'; // Ensure it's above other elements
            element.textContent = component.props.text || 'Unnamed Text';
            break;
        default:
            console.warn(`Unsupported component type: ${component.type}`);
            return null;
    }
    element.dataset.componentId = component.id;
    return element;
}

/**
 * Gets the font size based on the dynamic type setting from viewport.js.
 * @returns {string} The font size in em units.
 */
function getDynamicFontSize() {
    const canvas = document.getElementById('canvas');
    if (canvas && canvas.classList.contains('large-text')) {
        return '1.2em';
    }
    return '1em';
}

/**
 * Updates the rendering when the canvas state changes (e.g., color scheme, dynamic type).
 */
export function updateRender() {
    render();
}

// Export for external triggering
export default { render, updateRender };