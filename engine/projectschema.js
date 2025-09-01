/**
 * Project Schema: The new "Single Source of Truth" for the entire application.
 * Manages the file system, multiple views, and the currently active view.
 */

// --- PRIVATE STATE ---

let project = {
    projectName: "MyAwesomeApp",
    activeViewId: "view_001", // The ID of the file currently being edited
    fileSystem: {
        id: "root",
        type: "folder",
        name: "MyApp",
        children: [
            {
                id: "view_001",
                type: "file",
                fileType: "SwiftUIView",
                name: "ContentView.swift",
                content: { // The 'content' property now holds the component tree
                    id: 'root-content-view',
                    type: 'Container',
                    props: {},
                    children: []
                }
            }
        ]
    }
};

// --- HELPER FUNCTIONS ---

/**
 * Generates a unique ID for a component or file.
 * @param {string} prefix - 'comp' for component, 'file' for file, etc.
 * @returns {string} A unique identifier.
 */
function generateId(prefix = 'comp') {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

/**
 * Recursively finds any node (file or folder) in the file system tree by its ID.
 * @param {string} id The ID of the node to find.
 * @param {Object} node The current node in the tree to search from.
 * @returns {Object|null} The found node or null.
 */
function findNodeInTree(id, node = project.fileSystem) {
    if (node.id === id) {
        return node;
    }
    if (node.children) {
        for (const child of node.children) {
            const found = findNodeInTree(id, child);
            if (found) return found;
        }
    }
    return null;
}

/**
 * Recursively finds a component and its parent within a given component tree.
 * @param {string} componentId The ID of the component to find.
 * @param {Object} node The current component node to search from.
 * @param {Object} parent The parent of the current component node.
 * @returns {{node: Object, parent: Object}|null}
 */
function findComponentInTree(componentId, node, parent = null) {
    if (!node) return null;
    if (node.id === componentId) {
        return { node, parent };
    }
    if (node.children) {
        for (const child of node.children) {
            const found = findComponentInTree(componentId, child, node);
            if (found) return found;
        }
    }
    return null;
}


// --- PUBLIC API ---

/**
 * Retrieves the entire project object.
 * @returns {Object}
 */
export function getProject() {
    return project;
}

/**
 * Returns the file object for the currently active view.
 * @returns {Object|null}
 */
export function getActiveView() {
    return findNodeInTree(project.activeViewId);
}

/**
 * Returns the layout (root component) for the currently active view.
 * This function replaces the old `getLayout()`.
 * @returns {Object|null}
 */
export function getActiveViewLayout() {
    const activeView = getActiveView();
    return activeView ? activeView.content : null;
}

/**
 * Sets the new active view by its file ID.
 * @param {string} fileId
 */
export function setActiveView(fileId) {
    if (findNodeInTree(fileId)) {
        project.activeViewId = fileId;
    } else {
        console.error(`File with ID "${fileId}" not found.`);
    }
}

/**
 * Retrieves a component by its ID from the ACTIVE view.
 * @param {string} id The ID of the component.
 * @returns {Object|null}
 */
export function getComponentById(id) {
    const layout = getActiveViewLayout();
    if (!layout) return null;
    const result = findComponentInTree(id, layout);
    return result ? result.node : null;
}

/**
 * Adds a component to the ACTIVE view.
 * @param {Object} component The component object to add.
 * @param {string} [parentId] The ID of the parent component.
 */
export function addComponent(component) {
    const layout = getActiveViewLayout();
    if (layout) {
        // For now, adds to the root of the active view.
        // This can be enhanced later to add to a specific parentId.
        if (!component.id) component.id = generateId('comp');
        layout.children.push(component);
    }
}

/**
 * Updates properties of a component in the ACTIVE view.
 * @param {string} id The ID of the component to update.
 * @param {Object} newProps An object with the properties to update.
 */
export function updateComponent(id, newProps) {
    const component = getComponentById(id);
    if (component) {
        Object.assign(component.props, newProps);
    }
}

/**
 * Duplicates a component in the ACTIVE view.
 * @param {string} id The ID of the component to duplicate.
 */
export function duplicateComponent(id) {
    const layout = getActiveViewLayout();
    const result = findComponentInTree(id, layout);

    if (result && result.parent) {
        const originalNode = result.node;
        const newNode = JSON.parse(JSON.stringify(originalNode));

        function assignNewIds(node) {
            node.id = generateId('comp');
            if (node.children) node.children.forEach(assignNewIds);
        }
        assignNewIds(newNode);
        
        if (newNode.props.x !== undefined) newNode.props.x += 20;
        if (newNode.props.y !== undefined) newNode.props.y += 20;

        result.parent.children.push(newNode);
    }
}

/**
 * Deletes a component from the ACTIVE view.
 * @param {string} id The ID of the component to delete.
 */
export function deleteComponent(id) {
    const layout = getActiveViewLayout();
    const result = findComponentInTree(id, layout);

    if (result && result.parent) {
        const childIndex = result.parent.children.findIndex(child => child.id === id);
        if (childIndex !== -1) {
            result.parent.children.splice(childIndex, 1);
        }
    }
}
