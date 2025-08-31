/**
 * Layout schema module for managing components.
 */
let components = [];

/**
 * Generates a unique ID for a component.
 * @returns {string} A unique identifier.
 */
export function generateId() {
    return 'comp_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

/**
 * Adds a component to the schema.
 * @param {Object} component The component object with id, type, and props.
 */
export function addComponent(component) {
    components.push(component);
}

/**
 * Retrieves all components from the schema.
 * @returns {Array} Array of component objects.
 */
export function getComponents() {
    return [...components];
}

// Export the module
export default { generateId, addComponent, getComponents };