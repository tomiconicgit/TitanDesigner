const menuStyles = `
    :root {
        --panel-color: #1c1c1e;
        --border-color: #3a3a3c;
    }
    #menu-button-wrapper { position: relative; z-index: 6000; }
    #menu-button {
        display: flex; align-items: center; justify-content: center; gap: 8px;
        border-radius: 12px; width: 141px; font-size: 16px;
        background-color: rgb(40, 40, 43); color: white;
        padding: 10px 20px; cursor: pointer; user-select: none;
    }
    .menu-arrow { width: 12px; height: 12px; fill: currentColor; transition: transform 0.2s ease-in-out; }
    #menu-button.open .menu-arrow { transform: rotate(180deg); }
    #menu-dropdown {
        position: absolute; top: 110%; left: 50%; transform: translateX(-50%);
        background-color: #2c2c2e; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        overflow: hidden; width: 150px;
    }
    #menu-dropdown div { padding: 12px 20px; cursor: pointer; }
    #menu-dropdown div:hover { background-color: var(--border-color); }
    .panel {
        position: fixed; bottom: 0; left: 0; width: 100%; max-height: 50%;
        background-color: var(--panel-color);
        border-top-left-radius: 20px; border-top-right-radius: 20px;
        box-shadow: 0 -5px 20px rgba(0,0,0,0.5); transform: translateY(100%);
        transition: transform 0.3s ease-in-out; z-index: 7000;
    }
    .panel:not(.hidden) { transform: translateY(0); }
    .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid var(--border-color); }
    .close-btn { background: var(--border-color); border: none; color: white; font-size: 20px; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; }
    #ui-library-panel .panel-content { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 15px; padding: 20px; }
    .library-item { background: var(--border-color); border: none; color: white; padding: 15px; border-radius: 8px; cursor: pointer; text-align: center; font-size: 14px; }
    .hidden { display: none; }
`;

/**
 * Initializes the main menu and UI library panel.
 * @param {HTMLElement} parentElement The element to prepend the menu wrapper to.
 */
export function initViewportMenu(parentElement) {
    const styleElement = document.createElement('style');
    styleElement.textContent = menuStyles;
    document.head.appendChild(styleElement);

    // --- Create Menu Button and Dropdown ---
    const menuWrapper = document.createElement('div');
    menuWrapper.id = 'menu-button-wrapper';
    menuWrapper.innerHTML = `
        <div id="menu-button">
            Menu
            <svg class="menu-arrow" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5H7z"></path></svg>
        </div>
        <div id="menu-dropdown" class="hidden">
            <div id="menu-layouts">Layouts</div>
            <div id="menu-tools">Tools</div>
            <div id="menu-fullscreen">Full screen</div>
        </div>
    `;
    parentElement.prepend(menuWrapper); // Use prepend to put it above the iPhone frame

    // --- Create UI Library Panel ---
    const uiLibraryPanel = document.createElement('div');
    uiLibraryPanel.id = 'ui-library-panel';
    uiLibraryPanel.className = 'panel hidden';
    const libraryItems = ['Button', 'Text', 'Container', 'Card', 'Header', 'Bottom Bar', 'Input', 'Image', 'Avatar', 'Icon'];
    uiLibraryPanel.innerHTML = `
        <div class="panel-header">
            <h3>UI Library</h3>
            <button class="close-btn">×</button>
        </div>
        <div class="panel-content">
            ${libraryItems.map(item => `<button class="library-item" data-type="${item}">${item}</button>`).join('')}
        </div>
    `;
    document.body.appendChild(uiLibraryPanel);

    // --- Add Event Listeners ---
    const menuButton = document.getElementById('menu-button');
    const menuDropdown = document.getElementById('menu-dropdown');
    
    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        menuDropdown.classList.toggle('hidden');
        menuButton.classList.toggle('open');
    });

    document.getElementById('menu-tools').addEventListener('click', () => {
        uiLibraryPanel.classList.remove('hidden');
        menuDropdown.classList.add('hidden');
        menuButton.classList.remove('open');
    });

    document.addEventListener('click', () => {
        menuDropdown.classList.add('hidden');
        menuButton.classList.remove('open');
    });

    uiLibraryPanel.querySelector('.close-btn').addEventListener('click', () => {
        uiLibraryPanel.classList.add('hidden');
    });

    uiLibraryPanel.addEventListener('click', (e) => {
        if (e.target.classList.contains('library-item')) {
            const type = e.target.dataset.type;
            addComponentToCanvas(type);
            uiLibraryPanel.classList.add('hidden');
        }
    });
}

/**
 * Adds a new component to the canvas by interacting with the schema.
 * @param {string} type The component type (e.g., 'Text', 'Button').
 */
function addComponentToCanvas(type) {
    Promise.all([
        import(`../viewport/components/${type.toLowerCase()}.js`),
        import('../engine/layoutschema.js'),
        import('../engine/renderer.js')
    ]).then(([componentModule, schema, renderer]) => {
        const template = componentModule.createComponentTemplate();
        template.id = schema.generateId();
        schema.addComponent(template);
        renderer.render();
    }).catch(error => console.error(`Error adding component of type ${type}:`, error));
}
