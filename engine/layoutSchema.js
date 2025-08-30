// The single source of truth for the UI design.
export let layoutSchema = [];

// A function to add a new component to the schema.
export function addComponent(component) {
    layoutSchema.push(component);
}

// A function to update a component's properties (like its position).
export function updateComponent(id, newProps) {
    const component = layoutSchema.find(c => c.id === id);
    if (component) {
        // Merge the new properties into the existing props object.
        Object.assign(component.props, newProps);
    }
}

// A simple utility to generate unique IDs.
export function generateId() {
    return `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
