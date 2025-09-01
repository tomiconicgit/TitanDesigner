import * as schema from '../engine/projectschema.js';
import { render } from '../engine/renderer.js';

const devTreeStyles = `
    #developer-tree-panel {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #1c1c1e;
        z-index: 9000;
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
        display: flex;
        flex-direction: column;
    }
    #developer-tree-panel:not(.hidden) {
        transform: translateX(0);
    }
    .dt-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        padding-top: calc(env(safe-area-inset-top, 10px) + 10px);
        background-color: #2c2c2e;
        color: white;
        flex-shrink: 0;
    }
    .dt-header h3 { margin: 0; font-weight: 500; }
    .dt-header-actions button {
        background: none;
        border: 2px solid #555;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
    }
    .dt-file-list {
        padding: 20px;
        overflow-y: auto;
        flex-grow: 1;
    }
    .dt-file-item {
        background-color: #2c2c2e;
        color: #eee;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 10px;
        cursor: pointer;
        font-family: monospace;
    }
    .dt-file-item.active {
        background-color: #0a84ff;
        color: white;
    }
`;

function renderFileList(container) {
    const project = schema.getProject();
    const activeViewId = schema.getActiveView().id;
    let fileListHTML = '';

    // Simple recursive function to render files/folders
    function renderNode(node) {
        if (node.type === 'file') {
            const isActive = node.id === activeViewId ? 'active' : '';
            fileListHTML += `<div class="dt-file-item ${isActive}" data-file-id="${node.id}">${node.name}</div>`;
        }
        if (node.children) {
            node.children.forEach(renderNode);
        }
    }

    renderNode(project.fileSystem);
    container.innerHTML = fileListHTML;
}

export function initDeveloperTree() {
    const styleElement = document.createElement('style');
    styleElement.textContent = devTreeStyles;
    document.head.appendChild(styleElement);

    const panel = document.createElement('div');
    panel.id = 'developer-tree-panel';
    panel.className = 'hidden';
    panel.innerHTML = `
        <div class="dt-header">
            <h3>Project Files</h3>
            <div class="dt-header-actions">
                <button id="dt-add-file-btn">+</button>
            </div>
        </div>
        <div class="dt-file-list"></div>
    `;
    document.body.appendChild(panel);
    
    const fileListContainer = panel.querySelector('.dt-file-list');

    // Event Listener to open the panel
    document.getElementById('bar-btn-repo').addEventListener('click', () => {
        renderFileList(fileListContainer); // Re-render the list every time it's opened
        panel.classList.remove('hidden');
    });

    // Event Listener for switching views
    fileListContainer.addEventListener('click', (e) => {
        if (e.target.matches('.dt-file-item')) {
            const fileId = e.target.dataset.fileId;
            schema.setActiveView(fileId);
            render();
            panel.classList.add('hidden'); // Close panel after selection
        }
    });

    // TODO: Add functionality for the '+' button to create a new file.
}
