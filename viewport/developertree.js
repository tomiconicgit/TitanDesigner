import { getProject, getActiveView, setActiveView } from '../engine/projectschema.js';
import { render } from '../engine/renderer.js';

const treeStyles = `
    .developer-tree-panel {
        background: rgba(28, 28, 30, 0.8);
        color: white;
        height: 100%;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
        font-family: 'SF Pro Display', sans-serif;
    }

    .tree-item {
        display: flex;
        align-items: center;
        padding: 8px 0;
        cursor: pointer;
        border-radius: 6px;
        transition: background-color 0.2s ease;
        user-select: none;
    }

    .tree-item.folder:hover {
        background-color: rgba(60, 60, 60, 0.4);
    }

    .tree-item.file:hover {
        background-color: rgba(60, 60, 60, 0.4);
    }

    .tree-item.active-file {
        background-color: rgba(10, 132, 255, 0.2);
        color: #0a84ff;
    }

    .tree-item-label {
        margin-left: 8px;
        font-size: 16px;
    }

    .tree-item-icon {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        fill: #8e8e93; /* Default icon color */
        transition: transform 0.2s ease;
    }

    .tree-item.file .tree-item-icon {
        fill: #0a84ff; /* Blue icon for files */
    }

    .tree-item.folder[data-expanded="true"] .tree-item-icon {
        transform: rotate(90deg);
    }

    .tree-children {
        margin-left: 20px;
        border-left: 1px solid rgba(80, 80, 80, 0.6);
        padding-left: 10px;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
    }

    .hidden {
        display: none;
    }

    /* SVG icons */
    .icon-folder {
        fill: #a0a0a0;
    }
    .icon-file {
        fill: #0a84ff;
    }
`;

// A simple SVG for a folder icon.
const folderSvg = `<svg class="icon-folder" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`;

// A simple SVG for a file icon.
const fileSvg = `<svg class="icon-file" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>`;

/**
 * Initializes the developer tree panel.
 * @param {HTMLElement} parentElement The DOM element to attach the tree to.
 */
export function initDeveloperTree(parentElement) {
    const styleElement = document.createElement('style');
    styleElement.textContent = treeStyles;
    document.head.appendChild(styleElement);

    const treeContainer = document.createElement('div');
    treeContainer.className = 'developer-tree-panel';
    parentElement.appendChild(treeContainer);

    // Initial render
    renderFileTree(getProject().fileSystem, treeContainer);

    // Add event listener to the container to handle clicks
    treeContainer.addEventListener('click', (e) => {
        const target = e.target.closest('.tree-item');
        if (!target) return;

        const id = target.dataset.id;
        const type = target.dataset.type;

        if (type === 'file') {
            setActiveView(id);
            render();
            updateActiveFileHighlight();
        } else if (type === 'folder') {
            // Toggle folder expansion
            const isExpanded = target.dataset.expanded === 'true';
            target.dataset.expanded = !isExpanded;
            const children = target.nextElementSibling;
            if (children) {
                children.classList.toggle('hidden');
            }
        }
    });
}

/**
 * Recursively renders the file system tree.
 * @param {Object} node The current node (folder or file) to render.
 * @param {HTMLElement} parentElement The parent DOM element to append to.
 */
function renderFileTree(node, parentElement) {
    const itemElement = document.createElement('div');
    const nodeTypeClass = node.type === 'folder' ? 'folder' : 'file';
    itemElement.className = `tree-item ${nodeTypeClass}`;
    itemElement.dataset.id = node.id;
    itemElement.dataset.type = node.type;
    itemElement.innerHTML = `
        <span class="tree-item-icon">${node.type === 'folder' ? folderSvg : fileSvg}</span>
        <span class="tree-item-label">${node.name}</span>
    `;
    parentElement.appendChild(itemElement);

    if (node.children && node.children.length > 0) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-children';
        childrenContainer.classList.add('hidden'); // Start collapsed
        parentElement.appendChild(childrenContainer);

        node.children.forEach(child => {
            renderFileTree(child, childrenContainer);
        });
    }

    // Initial highlight for the active file
    updateActiveFileHighlight();
}

/**
 * Updates the highlight on the active file.
 */
function updateActiveFileHighlight() {
    const allItems = document.querySelectorAll('.tree-item');
    allItems.forEach(item => item.classList.remove('active-file'));
    const activeViewId = getActiveView().id;
    const activeFileEl = document.querySelector(`[data-id="${activeViewId}"]`);
    if (activeFileEl) {
        activeFileEl.classList.add('active-file');
    }
}
