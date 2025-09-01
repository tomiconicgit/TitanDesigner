import { getSelectedComponentId } from '../engine/interactions.js';
import { getComponentById, updateComponent, deleteComponent, duplicateComponent, generateId } from '../engine/projectschema.js';
import { render } from '../engine/renderer.js';

const toolbarStyles = `
    :root {
        --panel-color: rgba(28, 28, 30, 0.8);
        --border-color: rgba(80, 80, 80, 0.6);
        --text-secondary: #8e8e93;
    }

    /* Styles for the small pop-up menu (Options, Duplicate, Delete) */
    #context-menu {
        position: absolute;
        background-color: #2c2c2e;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        z-index: 8000;
        overflow: hidden;
    }
    #context-menu div { padding: 10px 20px; cursor: pointer; color: white; font-size: 14px; }
    #context-menu div:hover { background-color: var(--border-color); }
    #delete-btn { color: #ff453a; }

    /* General Panel Styles */
    .panel {
        position: fixed;
        bottom: 0; left: 0; width: 100%;
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        background: var(--panel-color);
        color: white;
        z-index: 7000;
        border-top: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
    }
    .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; border-bottom: 1px solid var(--border-color); }
    .panel-header h3 { margin: 0; font-weight: 500; }
    .panel-content { padding: 20px; overflow-y: auto; }
    .close-btn { background: #444; border: none; color: #eee; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; font-size: 16px; }

    .hidden {
        display: none !important;
    }

    /* Customisation Panel specific styles */
    #tools-panel { height: 50%; } /* Example height */
    .tool-group { margin-bottom: 25px; }
    .tool-group h4 { margin-bottom: 15px; color: var(--text-secondary); font-size: 13px; font-weight: 400; text-transform: uppercase; letter-spacing: 0.5px; }
    .control-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .control-row label { flex-basis: 35%; font-size: 14px; color: #ddd; }
    .control-row input, .control-row select { background-color: rgba(50,50,50,0.8); border: 1px solid var(--border-color); border-radius: 5px; padding: 6px 8px; color: white; width: auto; font-size: 14px; flex-grow: 1; }
    .color-input-group { display: flex; align-items: center; gap: 8px; flex-grow: 1; }
    .color-input-group input[type="color"] { padding: 0; height: 30px; width: 40px; border: none; flex-grow: 0; border-radius: 5px; }
`;

export function initCustomisationToolbar() {
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

    // --- Add Event Listeners ---
    document.getElementById('options-btn').addEventListener('click', () => {
        const selectedId = getSelectedComponentId();
        if (selectedId) {
            populateToolsPanel(selectedId);
            toolsPanel.classList.remove('hidden');
        }
        contextMenu.classList.add('hidden');
    });

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
        if (!target.dataset.style) return; // Ignore inputs without a data-style attribute
        
        const [prop, unit] = target.dataset.style.split(',');
        const value = unit === 'px' ? parseInt(target.value) : target.value;

        updateComponent(selectedId, { [prop]: value });
        render();
    });
}

export function showCustomisationMenu(componentEl, x, y) {
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
