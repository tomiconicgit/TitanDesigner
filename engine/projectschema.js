// ... Existing code ...

/**
 * Adds a new node (file or folder) to the file system.
 * @param {string} parentId The ID of the parent folder.
 * @param {Object} newNode The new node to add.
 */
export function addNode(parentId, newNode) {
    const parent = findNodeInTree(parentId);
    if (parent && parent.type === 'folder') {
        parent.children.push(newNode);
    } else {
        console.error(`Parent folder with ID "${parentId}" not found.`);
    }
}

/**
 * Renames a node in the file system.
 * @param {string} id The ID of the node to rename.
 * @param {string} newName The new name for the node.
 */
export function renameNode(id, newName) {
    const node = findNodeInTree(id);
    if (node) {
        node.name = newName;
    } else {
        console.error(`Node with ID "${id}" not found.`);
    }
}

/**
 * Deletes a node from the file system.
 * @param {string} id The ID of the node to delete.
 */
export function deleteNode(id) {
    const parent = findParentNode(id, project.fileSystem);
    if (parent) {
        parent.children = parent.children.filter(child => child.id !== id);
        if (project.activeViewId === id) {
            project.activeViewId = project.fileSystem.id; // Reset to root
        }
    } else {
        console.error(`Node with ID "${id}" not found.`);
    }
}

/**
 * Updates the content of a file.
 * @param {string} fileId The ID of the file.
 * @param {string} content The new content (e.g., Swift code or AST).
 */
export function updateFileContent(fileId, content) {
    const file = findNodeInTree(fileId);
    if (file && file.type === 'file') {
        file.content = content; // For now, store as raw content; later, use AST
    } else {
        console.error(`File with ID "${fileId}" not found.`);
    }
}

/**
 * Retrieves the content of a file.
 * @param {string} fileId The ID of the file.
 * @returns {string|Object|null} The file content.
 */
export function getFileContent(fileId) {
    const file = findNodeInTree(fileId);
    return file && file.type === 'file' ? file.content : null;
}

function findParentNode(id, node, parent = null) {
    if (node.children) {
        if (node.children.some(child => child.id === id)) {
            return node;
        }
        for (const child of node.children) {
            const found = findParentNode(id, child, node);
            if (found) return found;
        }
    }
    return null;
}