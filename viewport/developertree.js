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
        color: white;
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
        flex-shrink: 0;
        border-bottom: 1px solid #3a3a3c;
    }
    .dt-header h3 { 
        margin: 0; 
        font-weight: 500; 
    }
    .dt-header-actions button {
        background: #3a3a3c;
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        font-size: 22px;
        line-height: 32px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    .dt-header-actions button:hover {
        background-color: #555;
    }
    .dt-file-list {
        padding: 20px;
        overflow-y: auto;
        flex-grow: 1;
    }
    .dt-file-item {
        display: flex;
        align-items: center;
        gap: 12px;
        background-color: #2c2c2e;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 10px;
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 16px;
        transition: background-color 0.2s ease;
    }
    .dt-file-item.active {
        background-color: #0a84ff;
        color: white;
        font-weight: 500;
    }
`;

function renderFileList(container) {
    const project = schema.getProject();
    const activeView = schema.getActiveView();
    const activeViewId = activeView ? activeView.id : null;
    let fileListHTML = '';

    function renderNode(node) {
        if (node.type === 'file') {
            const isActive = node.id === activeViewId ? 'active' : '';
            fileListHTML += `<div class="dt-file-item ${isActive}" data-file-id="${node.id}">📄 ${node.name}</div>`;
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
        renderFileList(fileListContainer);
        panel.classList.remove('hidden');
    });

    // Event listener for the main close button (we'll make the header act as a close button for now)
    panel.querySelector('.dt-header h3').addEventListener('click', () => {
        panel.classList.add('hidden');
    });

    // Event Listener for switching views
    fileListContainer.addEventListener('click', (e) => {
        const fileItem = e.target.closest('.dt-file-item');
        if (fileItem) {
            const fileId = fileItem.dataset.fileId;
            schema.setActiveView(fileId);
            render();
            panel.classList.add('hidden');
        }
    });

    // Event listener for creating a new file
    document.getElementById('dt-add-file-btn').addEventListener('click', () => {
        const newFileName = prompt("Enter new view name (e.g., ProfileView):");
        if (newFileName && newFileName.trim() !== "") {
            schema.createNewFile(`${newFileName.trim()}.swift`);
            renderFileList(fileListContainer); // Re-render the list to show the new file
        }
    });
}
