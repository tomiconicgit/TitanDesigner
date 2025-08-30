// The single source of truth for the UI design.
export let layoutSchema = [];

// A function to add a new component to the schema.
export function addComponent(component) {
    // Default properties for size and style
    const defaults = {
        width: 120,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#3a3a3c',
        opacity: 1,
        // ADDED: Default shadow properties
        shadowEnabled: false,
        shadowOffsetX: 0,
        shadowOffsetY: 2,
        shadowBlur: 4,
        shadowColor: '#00000080',
    };

    // Merge the defaults with the component's initial properties
    component.props = { ...defaults, ...component.props };
    
    layoutSchema.push(component);
}

// A function to update a component's properties.
export function updateComponent(id, newProps) {
    const component = layoutSchema.find(c => c.id === id);
    if (component) {
        Object.assign(component.props, newProps);
    }
}

// A simple utility to generate unique IDs.
export function generateId() {
    return `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
