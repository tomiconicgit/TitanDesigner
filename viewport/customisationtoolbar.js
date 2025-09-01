const toolbarStyles = `
    :root {
        --panel-color: #1c1c1e;
        --border-color: #3a3a3c;
    }
    #context-menu {
        position: absolute; background-color: #2c2c2e; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 8000; overflow: hidden;
    }
    #context-menu div { padding: 12px 20px; cursor: pointer; }
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
    .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid var(--border-color); }
    .close-btn { background: var(--border-color); border: none; color: white; font-size: 20px; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; }
    .panel-content { padding: 15px; overflow-y: auto; max-height: calc(70vh - 60px); }
    .hidden { display: none; }
`;

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

    // Add Event Listeners
    document.getElementById('options-btn').addEventListener('click', () => {
        toolsPanel.classList.remove('hidden');
        contextMenu.classList.add('hidden');
        // populateToolsPanel(selectedElement); // This part needs to be implemented
    });
    toolsPanel.querySelector('.close-btn').addEventListener('click', () => {
        toolsPanel.classList.add('hidden');
    });
}

/**
 * Shows the context menu for a component. This is called by interactions.js.
 * @param {HTMLElement} component The selected component element.
 * @param {number} x The x-position for the menu.
 * @param {number} y The y-position for the menu.
 */
export function showCustomisationMenu(component, x, y) {
    const menu = document.getElementById('context-menu');
    menu.dataset.componentId = component.dataset.componentId;
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.classList.remove('hidden');

    // Hide menu on outside click
    const hideMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.classList.add('hidden');
            document.removeEventListener('click', hideMenu);
        }
    };
    // Use a timeout to prevent the same click from immediately closing the menu
    setTimeout(() => document.addEventListener('click', hideMenu), 0);
}
