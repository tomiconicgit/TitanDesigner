/**
 * Layout schema module for managing a hierarchical component tree.
 * This structure is designed to map directly to UI frameworks like SwiftUI.
 */

// The entire layout is now a single object with a root component.
let layout = {
    // You can add page-level properties here in the future
    // name: 'MainView',
    // backgroundColor: '#FFFFFF',
    root: {
        id: 'root',
        type: 'Container', // The base of the view, like a ZStack in SwiftUI
        props: {},
        children: []
    }
};

// --- Helper Function to search the tree ---
/**
 * Recursively finds a component and its parent by ID in the component tree.
 * @param {string} id The ID of the component to find.
 * @param {Object} node The current node in the tree to search from.
 * @param {Object} parent The parent of the current node.
 * @returns {{node: Object, parent: Object}|null} The found component and its parent, or null.
 */
function findComponentInTree(id, node = layout.root, parent = null) {
    if (node.id === id) {
        return { node, parent };
    }
    if (node.children) {
        for (const child of node.children) {
            const found = findComponentInTree(id, child, node);
            if (found) {
                return found;
            }
        }
    }
    return null;
}


// --- Public API ---

/**
 * Generates a unique ID for a component.
 * @returns {string} A unique identifier.
 */
export function generateId() {
    return 'comp_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

/**
 * Adds a component to the schema, optionally under a specific parent.
 * @param {Object} component The component object to add.
 * @param {string} [parentId='root'] The ID of the parent component.
 */
export function addComponent(component, parentId = 'root') {
    const parentSearchResult = findComponentInTree(parentId);
    if (parentSearchResult && parentSearchResult.node.children) {
        parentSearchResult.node.children.push(component);
    } else {
        // Fallback to adding to the root if parent isn't found or can't have children
        layout.root.children.push(component);
    }
}

/**
 * Retrieves the entire layout object.
 * @returns {Object} The complete layout object.
 */
export function getLayout() {
    return layout;
}

/**
 * Retrieves a component by its ID.
 * @param {string} id The ID of the component.
 * @returns {Object|null} The component object or null if not found.
 */
export function getComponentById(id) {
    const result = findComponentInTree(id);
    return result ? result.node : null;
}

/**
 * Updates specific properties of a component.
 * @param {string} id The ID of the component to update.
 * @param {Object} newProps An object with the properties to update.
 */
export function updateComponent(id, newProps) {
    const component = getComponentById(id);
    if (component) {
        // Merge the new properties into the existing props
        Object.assign(component.props, newProps);
    }
}

/**
 * Duplicates a component and all its children by its ID.
 * @param {string} id The ID of the component to duplicate.
 */
export function duplicateComponent(id) {
    const result = findComponentInTree(id);
    if (result && result.parent) { // Cannot duplicate the root element
        // Create a deep copy to avoid shared references
        const originalNode = result.node;
        const newNode = JSON.parse(JSON.stringify(originalNode));

        // Recursively assign new unique IDs to the duplicated node and all its children
        function assignNewIds(node) {
            node.id = generateId();
            if (node.children) {
                node.children.forEach(assignNewIds);
            }
        }
        assignNewIds(newNode);
        
        // Slightly offset the new component so it's not directly on top of the old one
        if (newNode.props.x !== undefined) newNode.props.x += 20;
        if (newNode.props.y !== undefined) newNode.props.y += 20;

        // Add the fully duplicated node to the same parent
        result.parent.children.push(newNode);
    }
}

/**
 * Deletes a component from the tree by its ID.
 * @param {string} id The ID of the component to delete.
 */
export function deleteComponent(id) {
    const result = findComponentInTree(id);
    if (result && result.parent) { // Cannot delete the root element
        const childIndex = result.parent.children.findIndex(child => child.id === id);
        if (childIndex !== -1) {
            result.parent.children.splice(childIndex, 1);
        }
    }
}
