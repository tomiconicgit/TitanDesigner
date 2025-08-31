const layoutStyles = `
    #control-toolbar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 40px;
        background-color: rgba(255, 255, 255, 0.9); /* Light theme */
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        z-index: 1001;
        padding: 0 10px;
    }

    #control-toolbar.dark {
        background-color: rgba(28, 28, 30, 0.9); /* Dark theme */
    }

    .toolbar-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 30px;
        margin: 0 5px;
        background-color: transparent;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        color: #007aff; /* iOS system blue */
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s ease, color 0.2s ease;
    }

    .toolbar-button:hover, .toolbar-button.active {
        background-color: rgba(0, 122, 255, 0.1); /* Subtle hover/active state */
        color: #005bb5;
    }

    #control-panel {
        position: fixed;
        top: 50%;
        left: -350px;
        width: 350px;
        height: 490px;
        transform: translateY(-50%);
        background-color: #ffffff; /* Light theme */
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        padding: 20px;
        box-sizing: border-box;
        transition: left 0.3s ease;
        z-index: 1000;
        overflow-y: auto;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    #control-panel.dark {
        background-color: #1c1c1e;
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
    }

    #control-panel.open {
        left: 0;
    }

    .control-section {
        margin-bottom: 20px;
    }

    .control-option {
        display: inline-block;
        width: 100px;
        height: 30px;
        padding: 5px;
        margin: 5px 0;
        background-color: #f5f5f5;
        color: #333333;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        cursor: pointer;
        text-align: center;
        line-height: 20px;
        transition: background-color 0.2s ease;
    }

    .control-option:hover {
        background-color: #e0e0e0;
    }

    .control-option.dark {
        background-color: #2c2c2e;
        color: #ffffff;
    }

    .control-option.dark:hover {
        background-color: #3a3a3c;
    }
`;

// Device list from original
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
 * Initializes the control panel with Xcode-like layout.
 */
export function initViewportLayouts() {
    const styleElement = document.createElement('style');
    styleElement.textContent = layoutStyles;
    document.head.appendChild(styleElement);

    // Toolbar
    const toolbar = document.createElement('div');
    toolbar.id = 'control-toolbar';

    const layoutButton = document.createElement('button');
    layoutButton.className = 'toolbar-button';
    layoutButton.textContent = 'Layouts';
    layoutButton.addEventListener('click', () => {
        showPanel('layouts');
        layoutButton.classList.add('active');
        libraryButton.classList.remove('active');
    });

    const libraryButton = document.createElement('button');
    libraryButton.className = 'toolbar-button';
    libraryButton.textContent = 'Library';
    libraryButton.addEventListener('click', () => {
        showPanel('library');
        libraryButton.classList.add('active');
        layoutButton.classList.remove('active');
    });

    toolbar.appendChild(layoutButton);
    toolbar.appendChild(libraryButton);
    document.body.appendChild(toolbar);

    // Single control panel
    const panel = document.createElement('div');
    panel.id = 'control-panel';
    document.body.appendChild(panel);

    // Sync theme with viewport
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.classList.contains('dark') ? panel.classList.add('dark') : panel.classList.remove('dark');
        toolbar.classList.toggle('dark', canvas.classList.contains('dark'));
    }

    function showPanel(type) {
        panel.innerHTML = ''; // Clear previous content
        panel.classList.add('open');
        if (type === 'layouts') {
            const sections = ['Device', 'Orientation', 'Colour Scheme', 'Dynamic Type', 'Preview Mode'];
            sections.forEach(section => {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'control-section';
                sectionDiv.innerHTML = `<h3>${section}</h3>`;
                panel.appendChild(sectionDiv);

                if (section === 'Device') {
                    Object.entries(deviceOptions).forEach(([name, ratio]) => {
                        const option = document.createElement('div');
                        option.className = 'control-option';
                        option.textContent = name.length > 15 ? name.substring(0, 15) + '...' : name;
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
                        option.className = 'control-option';
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
                        option.className = 'control-option';
                        option.textContent = scheme;
                        option.addEventListener('click', () => {
                            import('./viewport.js').then(({ updateColourScheme }) => {
                                updateColourScheme(scheme.toLowerCase());
                                panel.classList.remove('open');
                                if (scheme === 'dark') {
                                    panel.classList.add('dark');
                                    toolbar.classList.add('dark');
                                } else {
                                    panel.classList.remove('dark');
                                    toolbar.classList.remove('dark');
                                }
                            });
                        });
                        sectionDiv.appendChild(option);
                    });
                } else if (section === 'Dynamic Type') {
                    ['Small', 'Large'].forEach(type => {
                        const option = document.createElement('div');
                        option.className = 'control-option';
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
                        option.className = 'control-option';
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
        } else if (type === 'library') {
            const availableComponents = ['Text', 'Button', 'Header'];
            availableComponents.forEach(type => {
                const option = document.createElement('div');
                option.className = 'control-option';
                option.textContent = type;
                option.addEventListener('click', () => {
                    import('./viewport.js').then(({ addComponent }) => {
                        addComponent(type);
                        panel.classList.remove('open');
                    });
                });
                panel.appendChild(option);
            });
        }
    }

    // Initial panel setup
    showPanel('layouts');

    // Tap-off-to-close functionality
    document.addEventListener('click', (event) => {
        const panel = document.getElementById('control-panel');
        const toolbar = document.getElementById('control-toolbar');
        if (!panel.contains(event.target) && !toolbar.contains(event.target) && panel.classList.contains('open')) {
            panel.classList.remove('open');
            layoutButton.classList.remove('active');
            libraryButton.classList.remove('active');
        }
    });
}