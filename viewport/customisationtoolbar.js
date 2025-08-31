const customStyles = `
    #customisation-menu {
        position: absolute;
        background-colour: #333;
        colour: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 1001;
        display: none;
    }

    #customisation-tools-panel {
        position: fixed;
        bottom: 0;
        left: 400px; /* Position next to library if open */
        width: 400px;
        height: 300px;
        background-colour: #222;
        colour: white;
        padding: 20px;
        box-sizing: border-box;
        border-top: 2px solid #444;
        transition: bottom 0.3s ease;
        z-index: 1000;
        overflow-y: auto;
        display: none;
    }

    .customisation-option {
        padding: 5px;
        cursor: pointer;
    }

    .customisation-option:hover {
        background-colour: #444;
    }

    .tools-section {
        margin-bottom: 15px;
    }
`;

/**
 * Initialises the customisation toolbar.
 */
export function initCustomisationToolbar() {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);

    const menu = document.createElement('div');
    menu.id = 'customisation-menu';
    document.body.appendChild(menu);

    const toolsPanel = document.createElement('div');
    toolsPanel.id = 'customisation-tools-panel';
    document.body.appendChild(toolsPanel);

    // Drop-down menu options
    const options = ['Edit Colour', 'Edit Size', 'Open Tools'];
    options.forEach(opt => {
        const option = document.createElement('div');
        option.className = 'customisation-option';
        option.textContent = opt;
        option.addEventListener('click', () => handleCustomisationOption(opt, menu.dataset.componentId));
        menu.appendChild(option);
    });

    // Deep customisation tools (example options)
    const toolsOptions = [
        'Font Family', 'Background Colour', 'Border Radius', 'Shadow', 'Alignment', 'Padding', 'Margin', 'Opacity', 'Rotation', 'Scale'
    ];
    const toolsSection = document.createElement('div');
    toolsSection.className = 'tools-section';
    toolsSection.innerHTML = '<h3>Tools</h3>';
    toolsOptions.forEach(tool => {
        const toolOption = document.createElement('div');
        toolOption.className = 'customisation-option';
        toolOption.textContent = tool;
        toolOption.addEventListener('click', () => console.log(`Customising ${tool} for component ${toolsPanel.dataset.componentId}`)); // Implement customisation logic
        toolsSection.appendChild(toolOption);
    });
    toolsPanel.appendChild(toolsSection);

    // Close tools panel
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => toolsPanel.style.display = 'none');
    toolsPanel.appendChild(closeButton);
}

/**
 * Shows the drop-down menu for a component.
 * @param {HTMLElement} component The selected component element.
 * @param {number} x The x-position for the menu.
 * @param {number} y The y-position for the menu.
 */
export function showCustomisationMenu(component, x, y) {
    const menu = document.getElementById('customisation-menu');
    menu.dataset.componentId = component.dataset.componentId;
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.display = 'block';
}

/**
 * Handles selection from the customisation menu.
 * @param {string} opt The selected option.
 * @param {string} id The component ID.
 */
function handleCustomisationOption(opt, id) {
    const menu = document.getElementById('customisation-menu');
    menu.style.display = 'none';

    if (opt === 'Open Tools') {
        const toolsPanel = document.getElementById('customisation-tools-panel');
        toolsPanel.dataset.componentId = id;
        toolsPanel.style.display = 'block';
    } else if (opt === 'Edit Colour') {
        const newColour = prompt('Enter new colour (e.g., #ff0000)');
        if (newColour) {
            import('./viewport.js').then(({ updateComponentProps }) => {
                updateComponentProps(id, { colour: newColour });
            });
        }
    } // Add more options as needed
}