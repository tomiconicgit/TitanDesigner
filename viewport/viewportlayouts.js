const layoutStyles = `
    #viewport-toggle {
        position: fixed;
        top: 50px; /* Position as top tab */
        left: 0;
        width: 40px;
        height: 120px;
        background-color: #333;
        color: white;
        border: none;
        border-right: 2px solid #444;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        cursor: pointer;
        z-index: 1000;
        transform: rotate(90deg);
        transform-origin: bottom left;
        padding: 5px 0;
        white-space: pre;
        text-align: center;
    }

    #viewport-panel {
        position: fixed;
        top: 50%;
        right: -350px; /* Start off-screen */
        transform: translateY(-50%);
        width: 350px;
        height: 280px; /* 5:4 aspect ratio */
        background-color: #222;
        color: white;
        padding: 20px;
        box-sizing: border-box;
        border-left: 2px solid #444;
        transition: right 0.3s ease;
        z-index: 1000;
        overflow-y: auto;
    }

    #viewport-panel.open {
        right: 0; /* Slide in when open */
    }

    .viewport-option {
        padding: 10px;
        margin-bottom: 10px;
        background-color: #444;
        border-radius: 5px;
        cursor: pointer;
        text-align: center;
    }

    .viewport-option:hover {
        background-color: #555;
    }

    .viewport-section {
        margin-bottom: 15px;
    }
`;

// Xcode-like device list with exact logical resolutions (portrait)
const deviceOptions = {
    'iPhone SE (3rd gen)': '375 / 667',
    'iPhone 15': '393 / 852',
    'iPhone 15 Plus': '430 / 932',
    'iPhone 15 Pro': '393 / 852',
    'iPhone 15 Pro Max': '430 / 932',
    'iPad mini (6th gen)': '744 / 1133',
    'iPad Air (5th gen)': '820 / 1180',
    'iPad Pro (11-inch)': '834 / 1194',
    'iPad Pro (13-inch)': '1024 / 1366'
};

/**
 * Initializes the viewport layouts panel with Xcode-like controls.
 */
export function initViewportLayouts() {
    const styleElement = document.createElement('style');
    styleElement.textContent = layoutStyles;
    document.head.appendChild(styleElement);

    const toggleButton = document.createElement('button');
    toggleButton.id = 'viewport-toggle';
    toggleButton.textContent = 'L\nA\nY\nO\nU\nT\nS';
    document.body.appendChild(toggleButton);

    const panel = document.createElement('div');
    panel.id = 'viewport-panel';
    document.body.appendChild(panel);

    toggleButton.addEventListener('click', () => {
        panel.classList.toggle('open');
    });

    // Add sections for Xcode-like options
    const sections = ['Device', 'Orientation', 'Colour Scheme', 'Dynamic Type', 'Preview Mode'];

    sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'viewport-section';
        sectionDiv.innerHTML = `<h3>${section}</h3>`;
        panel.appendChild(sectionDiv);

        if (section === 'Device') {
            Object.entries(deviceOptions).forEach(([name, ratio]) => {
                const option = document.createElement('div');
                option.className = 'viewport-option';
                option.textContent = name;
                option.addEventListener('click', () => {
                    import('./viewport.js').then(({ updateAspectRatio }) => {
                        updateAspectRatio(ratio);
                        panel.classList.remove('open');
                    });
                });
                sectionDiv.appendChild(option);
            });
        } else if (section === 'Orientation') {
            ['Portrait', 'Landscape'].forEach(orient => {
                const option = document.createElement('div');
                option.className = 'viewport-option';
                option.textContent = orient;
                option.addEventListener('click', () => {
                    import('./viewport.js').then(({ updateOrientation }) => {
                        updateOrientation(orient.toLowerCase());
                        panel.classList.remove('open');
                    });
                });
                sectionDiv.appendChild(option);
            });
        } else if (section === 'Colour Scheme') {
            ['Light', 'Dark'].forEach(scheme => {
                const option = document.createElement('div');
                option.className = 'viewport-option';
                option.textContent = scheme;
                option.addEventListener('click', () => {
                    import('./viewport.js').then(({ updateColourScheme }) => {
                        updateColourScheme(scheme.toLowerCase());
                        panel.classList.remove('open');
                    });
                });
                sectionDiv.appendChild(option);
            });
        } else if (section === 'Dynamic Type') {
            ['Small', 'Large'].forEach(type => {
                const option = document.createElement('div');
                option.className = 'viewport-option';
                option.textContent = type;
                option.addEventListener('click', () => {
                    import('./viewport.js').then(({ updateDynamicType }) => {
                        updateDynamicType(type.toLowerCase());
                        panel.classList.remove('open');
                    });
                });
                sectionDiv.appendChild(option);
            });
        } else if (section === 'Preview Mode') {
            ['Live', 'Selectable'].forEach(mode => {
                const option = document.createElement('div');
                option.className = 'viewport-option';
                option.textContent = mode;
                option.addEventListener('click', () => {
                    import('./viewport.js').then(({ updatePreviewMode }) => {
                        updatePreviewMode(mode.toLowerCase());
                        panel.classList.remove('open');
                    });
                });
                sectionDiv.appendChild(option);
            });
        }
    });
}