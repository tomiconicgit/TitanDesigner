import * as schema from '../engine/projectschema.js';
import { render } from '../engine/renderer.js';

// All styles for this panel are now self-contained in this file.
const panelStyles = `
    #ui-library-panel {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        background: rgba(28, 28, 30, 0.8);
        border-top: 1px solid rgba(80, 80, 80, 0.6);
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40%;
        z-index: 7000;
        transform: translateY(100%);
        transition: transform 0.3s ease-in-out;
        color: white;
        display: flex;
        flex-direction: column;
    }

    #ui-library-panel:not(.hidden) {
        transform: translateY(0);
    }
    
    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        border-bottom: 1px solid rgba(80, 80, 80, 0.6);
    }

    .panel-header h3 {
        margin: 0;
        font-weight: 500;
    }

    .close-btn {
        background: #444;
        border: none;
        color: #eee;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
    }

    .panel-content {
        padding: 20px;
        overflow-y: auto;
    }
    
    .component-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 15px;
    }

    .component-add-btn {
        background-color: #3a3a3c;
        border: none;
        color: white;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        text-align: center;
        font-size: 14px;
        transition: background-color 0.2s ease;
    }

    .component-add-btn:hover {
        background-color: #555;
    }

    #folder-selection-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(28, 28, 30, 0.95);
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        z-index: 8000;
        width: 80%;
        max-width: 400px;
        color: white;
        padding: 20px;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }

    .modal-content {
        max-height: 300px;
        overflow-y: auto;
    }

    .folder-item {
        padding: 10px;
        cursor: pointer;
        border-radius: 6px;
    }

    .folder-item:hover {
        background-color: rgba(60, 60, 60, 0.4);
    }

    .folder-item.selected {
        background-color: rgba(10, 132, 255, 0.2);
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 15px;
    }

    .modal-btn {
        background: #3a3a3c;
        border: none;
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
    }

    .modal-btn:hover {
        background: #555;
    }

    .modal-btn.cancel {
        background: #ff453a;
    }
`;

const componentTypes = [
    'Header', 'Text', 'Button', 'Container', 'Card', 'Input', 'Image', 'Avatar', 'Icon', 'Bottom Bar'
];

/**
 * Initializes the UI Library panel.
 */
export async function initUiLibrary() {
    const styleElement = document.createElement('style');
    styleElement.textContent = panelStyles;
    document.head.appendChild(styleElement);

    const uiLibraryPanel = document.createElement('div');
    uiLibraryPanel.id = 'ui-library-panel';
    uiLibraryPanel.className = 'hidden';

    let componentButtonsHTML = '';
    for (const type of componentTypes) {
        const fileName = type.toLowerCase().replace(' ', '');
        componentButtonsHTML += `<button class="component-add-btn" data-component-type="${type}">${type}</button>`;
    }

    uiLibraryPanel.innerHTML = `
        <div class="panel-header">
            <h3>UI Library</h3>
            <button class="close-btn">×</button>
        </div>
        <div class="panel-content component-grid">
            ${componentButtonsHTML}
        </div>
    `;
    document.body.appendChild(uiLibraryPanel);

    uiLibraryPanel.querySelector('.close-btn').addEventListener('click', () => {
        uiLibraryPanel.className = 'hidden';
    });

    uiLibraryPanel.addEventListener('click', async (e) => {
        if (e.target.matches('.component-add-btn')) {
            const type = e.target.dataset.componentType;
            const fileName = type.toLowerCase().replace(' ', '');
            try {
                const module = await import(`./components/${fileName}.js`);
                const newComponent = module.createComponentTemplate();
                newComponent.id = schema.generateId();
                showFolderSelectionModal(newComponent, uiLibraryPanel);
            } catch (error) {
                console.error(`Failed to create component of type: ${type}`, error);
            }
        }
    });
}

function showFolderSelectionModal(component, uiLibraryPanel) {
    let modal = document.getElementById('folder-selection-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'folder-selection-modal';
        document.body.appendChild(modal);
    }

    const folders = collectFolders(schema.getProject().fileSystem);
    let selectedFolderId = schema.getProject().fileSystem.id; // Default to root

    modal.innerHTML = `
        <div class="modal-header">
            <h3>Select Folder</h3>
            <button class="close-btn">×</button>
        </div>
        <div class="modal-content">
            ${folders.map(folder => `
                <div class="folder-item" data-folder-id="${folder.id}">
                    ${'&nbsp;'.repeat(folder.depth * 2)}${folder.name}
                </div>
            `).join('')}
        </div>
        <div class="modal-actions">
            <button class="modal-btn cancel">Cancel</button>
            <button class="modal-btn confirm">Confirm</button>
        </div>
    `;

    modal.querySelectorAll('.folder-item').forEach(item => {
        item.addEventListener('click', () => {
            modal.querySelectorAll('.folder-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            selectedFolderId = item.dataset.folderId;
        });
    });

    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
        uiLibraryPanel.classList.add('hidden');
    });

    modal.querySelector('.modal-btn.cancel').addEventListener('click', () => {
        modal.remove();
        uiLibraryPanel.classList.add('hidden');
    });

    modal.querySelector('.modal-btn.confirm').addEventListener('click', () => {
        const fileName = prompt('Enter file name for the component:', `${component.type}View.swift`);
        if (fileName) {
            const newNode = {
                id: schema.generateId('file'),
                type: 'file',
                fileType: 'SwiftUIView',
                name: fileName,
                content: {
                    id: schema.generateId('comp'),
                    type: 'Container',
                    props: {},
                    children: [component]
                }
            };
            schema.addNode(selectedFolderId, newNode);
            schema.setActiveView(newNode.id);
            render();
        }
        modal.remove();
        uiLibraryPanel.classList.add('hidden');
    });
}

function collectFolders(node, depth = 0, folders = []) {
    if (node.type === 'folder') {
        folders.push({ id: node.id, name: node.name, depth });
        if (node.children) {
            node.children.forEach(child => collectFolders(child, depth + 1, folders));
        }
    }
    return folders;
}