/**
 * Interactions module for handling user interactions on the canvas.
 */

let draggedComponent = null;
let resizeHandle = null;

/**
 * Initialises event listeners for canvas interactions.
 */
export function initInteractions() {
    const canvas = document.getElementById('canvas');
    if (!canvas) {
        console.error("Canvas not found for interactions.");
        return;
    }

    canvas.addEventListener('mousedown', startInteraction);
    canvas.addEventListener('mousemove', handleInteraction);
    canvas.addEventListener('mouseup', stopInteraction);
    canvas.addEventListener('touchstart', startInteraction, { passive: true });
    canvas.addEventListener('touchmove', handleInteraction, { passive: true });
    canvas.addEventListener('touchend', stopInteraction);

    // Add tap for customisation
    canvas.addEventListener('click', handleTap);
    canvas.addEventListener('touchend', handleTap);
}

/**
 * Handles tap on a component to open customisation menu.
 * @param {MouseEvent|TouchEvent} event The event.
 */
function handleTap(event) {
    const target = event.target.closest('[data-component-id]');
    if (target && canvas.classList.contains('selectable')) {
        const clientX = event.type.includes('touch') ? event.changedTouches[0].clientX : event.clientX;
        const clientY = event.type.includes('touch') ? event.changedTouches[0].clientY : event.clientY;
        import('../viewport/customisationtoolbar.js').then(({ showCustomisationMenu }) => {
            showCustomisationMenu(target, clientX, clientY);
        });
    }
}

/**
 * Starts an interaction (drag or resize) when clicked.
 * @param {MouseEvent|TouchEvent} event The mouse or touch event.
 */
function startInteraction(event) {
    event.preventDefault();
    const target = event.target.closest('[data-component-id]');
    if (!target || !canvas.classList.contains('selectable')) return;

    const canvasRect = canvas.getBoundingClientRect();
    const clientX = event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
    const clientY = event.type.includes('touch') ? event.touches[0].clientY : event.clientY;
    const offsetX = clientX - canvasRect.left - parseInt(target.style.left || 0);
    const offsetY = clientY - canvasRect.top - parseInt(target.style.top || 0);

    if (isResizeHandle(event.target)) {
        resizeHandle = { element: target, offsetX, offsetY };
    } else {
        draggedComponent = { element: target, offsetX, offsetY };
        target.style.zIndex = '20'; // Bring to front while dragging
    }
}

/**
 * Handles dragging or resizing during interaction.
 * @param {MouseEvent|TouchEvent} event The mouse or touch event.
 */
function handleInteraction(event) {
    if (!draggedComponent && !resizeHandle) return;

    event.preventDefault();
    const canvasRect = canvas.getBoundingClientRect();
    const clientX = event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
    const clientY = event.type.includes('touch') ? event.touches[0].clientY : event.clientY;

    if (draggedComponent) {
        const x = clientX - canvasRect.left - draggedComponent.offsetX;
        const y = clientY - canvasRect.top - draggedComponent.offsetY;
        draggedComponent.element.style.left = `${x}px`;
        draggedComponent.element.style.top = `${y}px`;
        updateComponentPosition(draggedComponent.element.dataset.componentId, x, y);
    } else if (resizeHandle) {
        const width = Math.max(50, clientX - canvasRect.left - resizeHandle.offsetX + parseInt(resizeHandle.element.style.width || 0));
        const height = Math.max(50, clientY - canvasRect.top - resizeHandle.offsetY + parseInt(resizeHandle.element.style.height || 0));
        resizeHandle.element.style.width = `${width}px`;
        resizeHandle.element.style.height = `${height}px`;
        updateComponentSize(resizeHandle.element.dataset.componentId, width, height);
    }
}

/**
 * Stops the interaction and resets the component.
 * @param {MouseEvent|TouchEvent} event The mouse or touch event.
 */
function stopInteraction(event) {
    if (draggedComponent) {
        draggedComponent.element.style.zIndex = '10';
        draggedComponent = null;
    }
    if (resizeHandle) {
        resizeHandle = null;
    }
}

/**
 * Checks if the target is a resize handle (simplified, add visual handle later).
 * @param {HTMLElement} target The event target.
 * @returns {boolean} True if it's a resize handle.
 */
function isResizeHandle(target) {
    // Placeholder: Add a resize handle element (e.g., small div) to components later
    return false; // Enable when resize handles are implemented
}

/**
 * Updates the position of a component in the schema.
 * @param {string} id The component ID.
 * @param {number} x The new x-coordinate.
 * @param {number} y The new y-coordinate.
 */
function updateComponentPosition(id, x, y) {
    import('./layoutschema.js').then(({ getComponents, updateComponent }) => {
        const components = getComponents();
        const component = components.find(c => c.id === id);
        if (component) {
            component.props.x = x;
            component.props.y = y;
            updateComponent(component);
            import('./renderer.js').then(({ updateRender }) => updateRender());
        }
    });
}

/**
 * Updates the size of a component in the schema.
 * @param {string} id The component ID.
 * @param {number} width The new width.
 * @param {number} height The new height.
 */
function updateComponentSize(id, width, height) {
    import('./layoutschema.js').then(({ getComponents, updateComponent }) => {
        const components = getComponents();
        const component = components.find(c => c.id === id);
        if (component && (component.type === 'Image' || component.type === 'Button')) {
            component.props.width = width;
            component.props.height = height;
            updateComponent(component);
            import('./renderer.js').then(({ updateRender }) => updateRender());
        }
    });
}

// Initialise interactions when the module is imported
initInteractions();

// Export for external use
export default { initInteractions };