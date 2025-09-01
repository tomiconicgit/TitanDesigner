// MODIFIED: We now only need getSelectedComponentId from interactions.js
import { getSelectedComponentId } from '../engine/interactions.js';
import { getComponentById, updateComponent, deleteComponent, duplicateComponent, generateId } from '../engine/projectschema.js';
import { render } from '../engine/renderer.js';

// ... (toolbarStyles string remains exactly the same) ...
const toolbarStyles = `
    :root {
        --panel-color: rgba(28, 28, 30, 0.8);
        --border-color: rgba(80, 80, 80, 0.6);
        --text-secondary: #8e8e93;
    }
    /* ... all other styles ... */
    .color-input-group input[type="color"] { padding: 0; height: 30px; width: 40px; border: none; flex-grow: 0; border-radius: 5px; }
`;


export function initCustomisationToolbar() {
    // ... (styleElement and contextMenu creation remains the same) ...
    const styleElement = document.createElement('style');
    styleElement.textContent = toolbarStyles;
    document.head.appendChild(styleElement);

    const contextMenu = document.createElement('div');
    contextMenu.id = 'context-menu';
    contextMenu.className = 'hidden';
    contextMenu.innerHTML = `
        <div id="options-btn">Options</div>
        <div id="duplicate-btn">Duplicate</div>
        <div id="delete-btn">Delete</div>
    `;
    document.body.appendChild(contextMenu);
    
    // ... (toolsPanel creation remains the same) ...
    const toolsPanel = document.createElement('div');
    toolsPanel.id = 'tools-panel';
    toolsPanel.className = 'panel hidden';
    toolsPanel.innerHTML = `
        <div class="panel-header">
            <h3 id="panel-title">Customise</h3>
            <button class="close-btn">×</button>
        </div>
        <div class="panel-content"></div>
    `;
    document.body.appendChild(toolsPanel);

    // --- THIS IS THE MAJOR CHANGE ---
    // We add a listener to the canvas to wait for our custom event.
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.addEventListener('componentTapped', (e) => {
            showCustomisationMenu(e.detail.x, e.detail.y);
        });
    }

    // --- Event Listeners for the menu and panel ---
    document.getElementById('options-btn').addEventListener('click', () => {
        const selectedId = getSelectedComponentId();
        if (selectedId) {
            populateToolsPanel(selectedId);
            toolsPanel.classList.remove('hidden');
        }
        contextMenu.classList.add('hidden');
    });
    // ... (delete, duplicate, close, and input listeners remain the same) ...
    document.getElementById('delete-btn').addEventListener('click', () => {
        const selectedId = getSelectedComponentId();
        if (selectedId) {
            deleteComponent(selectedId);
            render();
        }
        contextMenu.classList.add('hidden');
    });

    document.getElementById('duplicate-btn').addEventListener('click', () => {
        const selectedId = getSelectedComponentId();
        if (selectedId) {
            duplicateComponent(selectedId);
            render();
        }
        contextMenu.classList.add('hidden');
    });

    toolsPanel.querySelector('.close-btn').addEventListener('click', () => {
        toolsPanel.classList.add('hidden');
    });
    
    toolsPanel.addEventListener('input', (e) => {
        const selectedId = getSelectedComponentId();
        if (!selectedId) return;
        const target = e.target;
        if (!target.dataset.style) return;
        const [prop, unit] = target.dataset.style.split(',');
        const value = unit === 'px' ? parseInt(target.value) : target.value;
        updateComponent(selectedId, { [prop]: value });
        render();
    });
}

// MODIFIED: The function signature is simpler now
export function showCustomisationMenu(x, y) {
    const menu = document.getElementById('context-menu');
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.classList.remove('hidden');

    const hideMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.classList.add('hidden');
            document.removeEventListener('click', hideMenu, true);
        }
    };
    setTimeout(() => document.addEventListener('click', hideMenu, true), 0);
}

// ... (populateToolsPanel function remains exactly the same) ...
function populateToolsPanel(componentId) {
    const component = getComponentById(componentId);
    if (!component) return;
    const content = document.querySelector('#tools-panel .panel-content');
    const props = component.props;
    document.getElementById('panel-title').textContent = `Customise ${component.type}`;
    let commonHTML = `<div class="tool-group"><h4>Layout</h4>
        <div class="control-row"><label>Width</label><input type="range" min="10" max="320" value="${props.width || 100}" data-style="width,px"></div>
        <div class="control-row"><label>Height</label><input type="range" min="10" max="400" value="${props.height || 50}" data-style="height,px"></div>
        </div>`;
    let specificHTML = '';
    if (component.type === 'Text' || component.type === 'Button') {
        specificHTML = `<div class="tool-group"><h4>Typography</h4>
            <div class="control-row"><label>Text</label><input type="text" value="${props.text || ''}" data-style="text,"></div>
            <div class="control-row"><label>Font Size</label><input type="range" min="8" max="72" value="${props.fontSize || 16}" data-style="fontSize,px"></div>
        </div>`;
    }
    content.innerHTML = commonHTML + specificHTML;
}
