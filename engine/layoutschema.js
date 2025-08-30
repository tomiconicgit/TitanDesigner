// This module will hold the "single source of truth" for the UI design.
// Every component on the canvas will be represented as an object in this array.

export let layoutSchema = [];

/**
 * Adds a new component object to the central layout schema.
 * @param {object} component The component to add.
 */
export function addComponent(component) {
    layoutSchema.push(component);
}

/**
 * Updates the properties of an existing component in the schema.
 * @param {string} id The ID of the component to update.
 * @param {object} newProps The new properties to assign.
 */
export function updateComponent(id, newProps) {
    const component = layoutSchema.find(c => c.id === id);
    if (component) {
        Object.assign(component.props, newProps);
    }
}

/**
 * Generates a unique ID for a new component.
 * @returns {string} A unique component ID.
 */
export function generateId() {
    return `comp_${Date.now()}`;
}