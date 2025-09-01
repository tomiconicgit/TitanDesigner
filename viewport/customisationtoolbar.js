// NEW: Added detailed styles for the tools panel
const toolbarStyles = `
    :root {
        --panel-color: #1c1c1e;
        --border-color: #3a3a3c;
        --text-secondary: #8e8e93;
    }
    #context-menu {
        position: absolute; background-color: #2c2c2e; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 8000; overflow: hidden;
    }
    #context-menu div { padding: 12px 20px; cursor: pointer; color: white; }
    #context-menu div:hover { background-color: var(--border-color); }
    #delete-btn { color: #ff453a; }

    #tools-panel {
        position: fixed; bottom: 0; left: 0; width: 100%; max-height: 70%;
        background-color: var(--panel-color);
        border-top-left-radius: 20px; border-top-right-radius: 20px;
        box-shadow: 0 -5px 20px rgba(0,0,0,0.5); transform: translateY(100%);
        transition: transform 0.3s ease-in-out; z-index: 7000;
    }
    #tools-panel:not(.hidden) { transform: translateY(0); }
    .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid var(--border-color); color: white; }
    .close-btn { background: var(--border-color); border: none; color: white; font-size: 20px; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; }
    #tools-panel .panel-content { padding: 15px; overflow-y: auto; max-height: calc(70vh - 60px); }
    .tool-group { margin-bottom: 20px; }
    .tool-group h4 { margin-bottom: 10px; color: var(--text-secondary); font-size: 14px; text-transform: uppercase; }
    .control-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .control-row label { flex-basis: 35%; font-size: 14px; color: #ddd; }
    .control-row input, .control-row select { background-color: var(--border-color); border: 1px solid #545458; border-radius: 5px; padding: 5px; color: white; width: auto; font-size: 14px; flex-grow: 1; }
    .color-input-group { display: flex; align-items: center; gap: 8px; flex-grow: 1; }
    .color-input-group input[type="color"] { padding: 0; height: 30px; width: 40px; border: none; flex-grow: 0; }
    .hidden { display: none; }
`;

let currentComponent = null; // Module-level variable to store the selected component

/**
 * Initializes the context menu and the customization tools panel.
 */
export function initCustomisationToolbar() {
    const styleElement = document.createElement('style');
    styleElement.textContent = toolbarStyles;
    document.head.appendChild(styleElement);

    // Create Context Menu
    const contextMenu = document.createElement('div');
    contextMenu.id = 'context-menu';
    contextMenu.className = 'hidden';
    contextMenu.innerHTML = `
        <div id="options-btn">Options</div>
        <div id="duplicate-btn">Duplicate</div>
        <div id="delete-btn">Delete</div>
        <div id="copy-code-btn">Copy Code</div>
    `;
    document.body.appendChild(contextMenu);

    // Create Tools Panel
    const toolsPanel = document.createElement('div');
    toolsPanel.id = 'tools-panel';
    toolsPanel.className = 'hidden';
    toolsPanel.innerHTML = `
        <div class="panel-header">
            <h3 id="panel-title">Customise Element</h3>
            <button class="close-btn">×</button>
        </div>
        <div class="panel-content"></div>
    `;
    document.body.appendChild(toolsPanel);

    // --- Add Event Listeners ---
    document.getElementById('options-btn').addEventListener('click', () => {
        if (currentComponent) {
            populateToolsPanel(currentComponent);
            toolsPanel.classList.remove('hidden');
        }
        contextMenu.classList.add('hidden');
    });

    // Add other context menu actions (delete, duplicate) here if needed

    toolsPanel.querySelector('.close-btn').addEventListener('click', () => {
        toolsPanel.classList.add('hidden');
    });
    
    // Live-update listener
    toolsPanel.addEventListener('input', (e) => {
        // This logic needs to be built out to update the layout schema
        console.log(`Updated ${e.target.dataset.style} to ${e.target.value}`);
    });
}

/**
 * Shows the context menu for a component. This is called by interactions.js.
 * @param {HTMLElement} componentEl The selected component element.
 * @param {number} x The x-position for the menu.
 * @param {number} y The y-position for the menu.
 */
export function showCustomisationMenu(componentEl, x, y) {
    currentComponent = componentEl; // Store the selected element
    const menu = document.getElementById('context-menu');
    menu.dataset.componentId = componentEl.dataset.componentId;
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

/**
 * Populates the tools panel with controls for the selected element.
 * @param {HTMLElement} element The selected component element.
 */
function populateToolsPanel(element) {
    const content = document.querySelector('#tools-panel .panel-content');
    const style = getComputedStyle(element);
    const type = element.className.match(/ui-(\w+)/)[1]; // Extract type from class
    
    document.getElementById('panel-title').textContent = `Customise ${type}`;

    const createColorInput = (label, value, dataAttr) => `<div class="control-row"><label>${label}</label><div class="color-input-group"><input type="color" value="${value}" ${dataAttr}><input type="text" class="hex-input" value="${value}" maxlength="7"></div></div>`;
    
    let commonHTML = `<div class="tool-group"><h4>Layout</h4>
        <div class="control-row"><label>Width (px)</label><input type="range" min="10" max="400" value="${parseInt(style.width)}" data-style="width,px"></div>
        <div class="control-row"><label>Height (px)</label><input type="range" min="10" max="800" value="${parseInt(style.height)}" data-style="height,px"></div>
        </div>
        <div class="tool-group"><h4>Appearance</h4>
        ${createColorInput('Background', rgbToHex(style.backgroundColor), 'data-style="backgroundColor,"')}
        <div class="control-row"><label>Radius</label><input type="range" min="0" max="100" value="${parseInt(style.borderRadius)}" data-style="borderRadius,px"></div>
        </div>`;
    
    let specificHTML = '';
    if (type === 'text' || type === 'button') {
        specificHTML = `<div class="tool-group"><h4>Typography</h4>
            ${createColorInput('Text Color', rgbToHex(style.color), 'data-style="color,"')}
            <div class="control-row"><label>Font Size</label><input type="range" min="8" max="72" value="${parseInt(style.fontSize)}" data-style="fontSize,px"></div>
        </div>`;
    }
    content.innerHTML = commonHTML + specificHTML;
}

// Helper function to convert RGB to Hex
function rgbToHex(rgb) {
    if (!rgb || rgb.indexOf('rgb') === -1 || rgb === 'rgba(0, 0, 0, 0)') return '#000000';
    let match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d\.]+)?\)$/);
    if (!match) return '#FFFFFF';
    return "#" + ((1 << 24) + (+match[1] << 16) + (+match[2] << 8) + +match[3]).toString(16).slice(1).toUpperCase();
}
