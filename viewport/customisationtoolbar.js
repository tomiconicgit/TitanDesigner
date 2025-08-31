const customStyles = `
    #custom-menu {
        position: absolute;
        background-color: #333;
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 1001;
        display: none;
    }

    #custom-tools-panel {
        position: fixed;
        bottom: 0;
        left: 400px; /* Position next to library if open */
        width: 400px;
        height: 300px;
        background-color: #222;
        color: white;
        padding: 20px;
        box-sizing: border-box;
        border-top: 2px solid #444;
        transition: bottom 0.3s ease;
        z-index: 1000;
        overflow-y: auto;
        display: none;
    }

    .custom-option {
        padding: 5px;
        cursor: pointer;
    }

    .custom-option:hover {
        background-color: #444;
    }

    .tools-section {
        margin-bottom: 15px;
    }
`;

/**
 * Initializes the customisation toolbar.
 */
export function initCustomisationToolbar() {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);

    const menu = document.createElement('div');
    menu.id = 'custom-menu';
    document.body.appendChild(menu);

    const toolsPanel = document.createElement('div');
    toolsPanel.id = 'custom-tools-panel';
    document.body.appendChild(toolsPanel);

    // Drop-down menu options
    const options = ['Edit Colour', 'Edit Size', 'Open Tools'];
    options.forEach(opt => {
        const option = document.createElement('div');
        option.className = 'custom-option';
        option.textContent = opt;
        option.addEventListener('click', () => handleCustomOption(opt, menu.dataset.componentId));
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
        toolOption.className = 'custom-option';
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
 * @param {number