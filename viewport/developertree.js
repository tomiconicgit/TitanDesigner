import { getProject, getActiveView, setActiveView, generateId, addNode, renameNode, deleteNode, findNodeInTree } from '../engine/projectschema.js';
import { render } from '../engine/renderer.js';
import { showCodeEditor } from './codeeditor.js';

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
        position: relative;
    }

    .tree-item.folder:hover, .tree-item.file:hover {
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
        fill: #8e8e93;
        transition: transform 0.2s ease;
    }

    .tree-item.file .tree-item-icon {
        fill: #0a84ff;
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

    .context-menu {
        position: absolute;
        background-color: #2c2c2e;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        z-index: 8000;
        overflow: hidden;
        min-width: 120px;
    }

    .context-menu div {
        padding: 10px 20px;
        cursor: pointer;
        color: white;
        font-size: 14px;
    }

    .context-menu div:hover {
        background-color: rgba(80, 80, 80, 0.6);
    }

    .context-menu div.delete {
        color: #ff453a;
    }

    .hidden {
        display: none;
    }

    .icon-folder { fill: #a0a0a0; }
    .icon-file { fill: #0a84ff; }
`;

const folderSvg = `<svg class="icon-folder" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`;
const fileSvg = `<svg class="icon-file" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>`;

export function initDeveloperTree(parentElement) {
    const styleElement = document.createElement('style');
    styleElement.textContent = treeStyles;
    document.head.appendChild(styleElement);

    const treeContainer = document.createElement('div');
    treeContainer.className = 'developer-tree-panel';
    parentElement.appendChild(treeContainer);

    renderFileTree(getProject().fileSystem, treeContainer);

    treeContainer.addEventListener('click', (e) => {
        const target = e.target.closest('.tree-item');
        if (!target) return;

        const id = target.dataset.id;
        const type = target.dataset.type;

        if (type === 'file') {
            setActiveView(id);
            render();
            updateActiveFileHighlight();
            showCodeEditor(id); // Show code editor for the selected file
        } else if (type === 'folder') {
            const isExpanded = target.dataset.expanded === 'true';
            target.dataset.expanded = !isExpanded;
            const children = target.nextElementSibling;
            if (children) {
                children.classList.toggle('hidden');
            }
        }
    });

    treeContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const target = e.target.closest('.tree-item');
        if (!target) return;

        const id = target.dataset.id;
        const type = target.dataset.type;
        showContextMenu(id, type, e.clientX, e.clientY);
    });
}

function renderFileTree(node, parentElement) {
    const itemElement = document.createElement('div');
    const nodeTypeClass = node.type === 'folder' ? 'folder' : 'file';
    itemElement.className = `tree-item ${nodeTypeClass}`;
    itemElement.dataset.id = node.id;
    itemElement.dataset.type = node.type;
    itemElement.dataset.expanded = node.type === 'folder' ? 'false' : undefined;
    itemElement.innerHTML = `
        <span class="tree-item-icon">${node.type === 'folder' ? folderSvg : fileSvg}</span>
        <span class="tree-item-label">${node.name}</span>
    `;
    parentElement.appendChild(itemElement);

    if (node.children && node.children.length > 0) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-children hidden';
        parentElement.appendChild(childrenContainer);

        node.children.forEach(child => {
            renderFileTree(child, childrenContainer);
        });
    }

    updateActiveFileHighlight();
}

function updateActiveFileHighlight() {
    const allItems = document.querySelectorAll('.tree-item');
    allItems.forEach(item => item.classList.remove('active-file'));
    const activeViewId = getActiveView()?.id;
    if (activeViewId) {
        const activeFileEl = document.querySelector(`[data-id="${activeViewId}"]`);
        if (activeFileEl) {
            activeFileEl.classList.add('active-file');
        }
    }
}

function showContextMenu(id, type, x, y) {
    let contextMenu = document.getElementById('tree-context-menu');
    if (!contextMenu) {
        contextMenu = document.createElement('div');
        contextMenu.id = 'tree-context-menu';
        contextMenu.className = 'context-menu hidden';
        document.body.appendChild(contextMenu);
    }

    contextMenu.innerHTML = `
        <div class="new-file">New File</div>
        <div class="new-folder">New Folder</div>
        <div class="rename">Rename</div>
        <div class="delete">Delete</div>
    `;
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.classList.remove('hidden');

    const hideMenu = (e) => {
        if (!contextMenu.contains(e.target)) {
            contextMenu.classList.add('hidden');
            document.removeEventListener('click', hideMenu, true);
        }
    };
    setTimeout(() => document.addEventListener('click', hideMenu, true), 0);

    contextMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('new-file')) {
            promptNewNode(id, 'file');
        } else if (e.target.classList.contains('new-folder')) {
            promptNewNode(id, 'folder');
        } else if (e.target.classList.contains('rename')) {
            promptRenameNode(id);
        } else if (e.target.classList.contains('delete')) {
            deleteNode(id);
        }
        contextMenu.classList.add('hidden');
    });
}

function promptNewNode(parentId, type) {
    const name = prompt(`Enter ${type} name:`);
    if (name) {
        const newNode = {
            id: generateId(type),
            type,
            name,
            ...(type === 'folder' ? { children: [] } : { fileType: 'SwiftUIView', content: { id: generateId('comp'), type: 'Container', props: {}, children: [] } })
        };
        addNode(parentId, newNode);
        refreshTree();
    }
}

function promptRenameNode(id) {
    const node = findNodeInTree(id);
    if (node) {
        const newName = prompt('Enter new name:', node.name);
        if (newName) {
            renameNode(id, newName);
            refreshTree();
        }
    }
}

function refreshTree() {
    const treeContainer = document.querySelector('.developer-tree-panel');
    if (treeContainer) {
        treeContainer.innerHTML = '';
        renderFileTree(getProject().fileSystem, treeContainer);
    }
}