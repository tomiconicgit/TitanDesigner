const libraryStyles = `
    #library-toggle {
        position: fixed;
        bottom: 20px;
        left: 10px;
        padding: 10px 15px;
        background-color: #333;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
    }

    #library-panel {
        position: fixed;
        bottom: 0;
        left: -400px; /* Start off-screen */
        width: 400px;
        height: 200px;
        background-color: #222;
        color: white;
        padding: 20px;
        box-sizing: border-box;
        border-top: 2px solid #444;
        transition: left 0.3s ease;
        z-index: 1000;
        overflow-x: auto;
    }

    #library-panel.open {
        left: 0; /* Slide in when open */
    }

    .library-option {
        display: inline-block;
        padding: 10px;
        margin: 5px;
        background-color: #444;
        border-radius: 5px;
        cursor: pointer;
        text-align: center;
    }

    .library-option:hover {
        background-color: #555;
    }
`;

const availableComponents = ['Text', 'Button', 'Header']; // Add more as files are created

/**
 * Initializes the component library toolbar.
 */
export function initComponentLibrary() {
    const styleElement = document.createElement('style');
    styleElement.textContent = libraryStyles;
    document.head.appendChild(styleElement);

    const toggleButton = document.createElement('button');
    toggleButton.id = 'library-toggle';
    toggleButton.textContent = 'Library';
    document.body.appendChild(toggleButton);

    const panel = document.createElement('div');
    panel.id = 'library-panel';
    document.body.appendChild(panel);

    toggleButton.addEventListener('click', () => {
        panel.classList.toggle('open');
    });

    // Populate panel with component options
    availableComponents.forEach(type => {
        const option = document.createElement('div');
        option.className = 'library-option';
        option.textContent = type;
        option.addEventListener('click', () => {
            import('./viewport.js').then(({ addComponent }) => {
                addComponent(type);
                panel.classList.remove('open'); // Close panel after addition
            });
        });
        panel.appendChild(option);
    });
}