export let layoutSchema = [];

export function addComponent(component) {
    const defaults = {
        width: 120,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#3a3a3c',
        opacity: 1,
        shadowEnabled: false,
        shadowOffsetX: 0,
        shadowOffsetY: 2,
        shadowBlur: 4,
        shadowColor: '#00000080',
        ...(component.type === 'Text' ? {
            font: 'body',
            fontWeight: 'regular',
            foregroundColor: '#ffffff'
        } : {}),
    };

    component.props = { ...defaults, ...component.props };
    layoutSchema.push(component);
}

export function updateComponent(id, newProps) {
    const component = layoutSchema.find(c => c.id === id);
    if (component) {
        Object.assign(component.props, newProps);
    }
}

export function generateId() {
    return `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}