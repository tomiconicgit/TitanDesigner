const layoutStyles = `
    #layout-toggle {
        position: fixed;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        padding: 10px 15px;
        background-color: #333;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
    }

    #layout-panel {
        position: fixed;
        top: 50%;
        right: -300px; /* Start off-screen */
        transform: translateY(-50%);
        width: 300px;
        height: 240px; /* 5:4 aspect ratio (300px / 240px) */
        background-color: #222;
        color: white;
        padding: 20px;
        box-sizing: border-box;
        border-left: 2px solid #444;
        transition: right 0.3s ease;
        z-index: 1000;
        overflow-y: auto;
    }

    #layout-panel.open {
        right: 0; /* Slide in when open */
    }

    .layout-option {
        padding: 10px;
        margin-bottom: 10px;
        background-color: #444;
        border-radius: 5px;
        cursor: pointer;
        text-align: center;
    }

    .layout-option:hover {
        background-color: #555;
    }
`;

const layoutOptions = {
    'iPhone 16': '9 / 19.5',
    'iPhone 16 Pro Max': '9 / 19.5',
    'iPhone 15': '9 / 19.5',
    'iPhone 15 Pro Max': '9 / 19.5',
    'iPhone SE': '9 / 16',
    'iPad (all gens)': '4 / 3'
};

/**
 * Initializes the layout toggle and panel.
 */
export function initLayoutToggle() {
    const styleElement = document.createElement('style');
    styleElement.textContent = layoutStyles;
    document.head.appendChild(styleElement);

    const toggleButton = document.createElement('button');
    toggleButton.id = 'layout-toggle';
    toggleButton.textContent = 'Layouts';
    document.body.appendChild(toggleButton);

    const panel = document.createElement('div');
    panel.id = 'layout-panel';
    document.body.appendChild(panel);

    toggleButton.addEventListener('click', () => {
        panel.classList.toggle('open');
    });

    // Populate panel with layout options
    Object.entries(layoutOptions).forEach(([name, ratio]) => {
        const option = document.createElement('div');
        option.className = 'layout-option';
        option.textContent = name;
        option.addEventListener('click', () => {
            import('./canvasbuilder.js').then(({ updateCanvasAspectRatio }) => {
                updateCanvasAspectRatio(ratio);
                panel.classList.remove('open'); // Close panel after selection
            });
        });
        panel.appendChild(option);
    });
}