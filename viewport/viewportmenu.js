const layoutStyles = `
    #control-bar {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 50px;
        background-color: rgba(255, 255, 255, 0.9); /* Light theme */
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 25px; /* Pill shape */
        display: flex;
        align-items: center;
        justify-content: space-around;
        z-index: 1002;
        transition: background-color 0.2s ease;
    }

    #control-bar.dark {
        background-color: rgba(28, 28, 30, 0.9);
        border-color: rgba(255, 255, 255, 0.1);
    }

    #control-bar:hover {
        background-color: rgba(0, 122, 255, 0.1);
    }

    .control-option {
        width: 90px;
        height: 40px;
        background-color: transparent;
        color: #007aff; /* iOS system blue */
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s ease;
    }

    .control-option:hover {
        color: #005bb5;
    }

    .control-option.dark {
        color: #0a84ff;
    }

    .control-option.dark:hover {
        color: #0066cc;
    }

    .divider {
        width: 1px;
        height: 30px;
        background-color: rgba(0, 0, 0, 0.1);
    }

    #control-panel {
        position: fixed;
        top: 0;
        right: -400px; /* Start fully off-screen right */
        width: 400px;
        height: 100dvh; /* Full screen height */
        background-color: #2E2E2E; /* Match Xcode background */
        border-left: 1px solid rgba(0, 0, 0, 0.1);
        padding: 20px;
        box-sizing: border-box;
        transition: right 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Ease-in-out with bounce */
        z-index: 1001;
        overflow-y: auto;
        box-shadow: -2px 0 6px rgba(0, 0, 0, 0.2);
    }

    #control-panel.dark {
        background-color: #1c1c1e;
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
    }

    #control-panel.open {
        right: 0; /* Slide out fully */
    }

    .control-section {
        margin-bottom: 20px;
    }

    .control-item {
        padding: 10px;
        cursor: pointer;
        color: #ffffff;
        transition: background-color 0.2s ease;
    }

    .control-item:hover {
        background-color: rgba(255, 255, 255, 0.1);
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
 * Initializes the control panel with a pill-shaped bar and sliding side panel.
 */
export function initViewportLayouts() {
    const styleElement = document.createElement('style');
    styleElement.textContent = layoutStyles;
    document.head.appendChild(styleElement);

    // Control bar
    const controlBar = document.createElement('div');
    controlBar.id = 'control-bar';
    document.body.appendChild(controlBar);

    // Control panel
    const panel = document.createElement('div');
    panel.id = 'control-panel';
    document.body.appendChild(panel);

    // Sync theme with viewport
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.classList.contains('dark') ? controlBar.classList.add('dark') : controlBar.classList.remove('dark');
        canvas.classList.contains('dark') ? panel.classList.add('dark') : panel.classList.remove('dark');
    }

    // Initialize pill bar with options
    let isOpen = false;
    let currentPanel = null;
    const options = [
        { name: 'Layouts', label: 'Layouts' },
        { name: 'Library', label: 'Library' }
    ];
    options.forEach((opt, index) => {
        const option = document.createElement('div');
        option.className = 'control-option';
        option.textContent = opt.label;
        option.dataset.type = opt.name.toLowerCase();
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            isOpen = !isOpen;
            panel.classList.toggle('open', isOpen);
            if (isOpen) {
                currentPanel = opt.name.toLowerCase();
                showPanel(currentPanel);
            } else {
                currentPanel = null;
            }
        });
        controlBar.appendChild(option);
        if (index === 0) {
            const divider = document.createElement('div');
            divider.className = 'divider';
            controlBar.appendChild(divider);
        }
    });

    function showPanel(type) {
        panel.innerHTML = '';
        if (type === 'layouts') {
            const sections = ['Device', 'Orientation', 'Colour Scheme', 'Dynamic Type', 'Preview Mode'];
            sections.forEach(section => {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'control-section';
                sectionDiv.innerHTML = `<h3>${section}</h3>`;
                panel.appendChild(sectionDiv);

                if (section === 'Device') {
                    Object.entries(deviceOptions).forEach(([name, ratio]) => {
                        const item = document.createElement('div');
                        item.className = 'control-item';
                        item.textContent = name.length > 15 ? name.substring(0, 15) + '...' : name;
                        item.addEventListener('click', () => {
                            import('./viewport.js').then(({ updateAspectRatio }) => {
                                updateAspectRatio(ratio);
                            });
                        });
                        sectionDiv.appendChild(item);
                    });
                } else if (section === 'Orientation') {
                    ['Portrait', 'Landscape'].forEach(orient => {
                        const item = document.createElement('div');
                        item.className = 'control-item';
                        item.textContent = orient;
                        item.addEventListener('click', () => {
                            import('./viewport.js').then(({ updateOrientation }) => {
                                updateOrientation(orient.toLowerCase());
                            });
                        });
                        sectionDiv.appendChild(item);
                    });
                } else if (section === 'Colour Scheme') {
                    ['Light', 'Dark'].forEach(scheme => {
                        const item = document.createElement('div');
                        item.className = 'control-item';
                        item.textContent = scheme;
                        item.addEventListener('click', () => {
                            import('./viewport.js').then(({ updateColourScheme }) => {
                                updateColourScheme(scheme.toLowerCase());
                                if (scheme === 'dark') {
                                    panel.classList.add('dark');
                                    controlBar.classList.add('dark');
                                } else {
                                    panel.classList.remove('dark');
                                    controlBar.classList.remove('dark');
                                }
                            });
                        });
                        sectionDiv.appendChild(item);
                    });
                } else if (section === 'Dynamic Type') {
                    ['Small', 'Large'].forEach(type => {
                        const item = document.createElement('div');
                        item.className = 'control-item';
                        item.textContent = type;
                        item.addEventListener('click', () => {
                            import('./viewport.js').then(({ updateDynamicType }) => {
                                updateDynamicType(type.toLowerCase());
                            });
                        });
                        sectionDiv.appendChild(item);
                    });
                } else if (section === 'Preview Mode') {
                    ['Live', 'Selectable'].forEach(mode => {
                        const item = document.createElement('div');
                        item.className = 'control-item';
                        item.textContent = mode;
                        item.addEventListener('click', () => {
                            import('./viewport.js').then(({ updatePreviewMode }) => {
                                updatePreviewMode(mode.toLowerCase());
                            });
                        });
                        sectionDiv.appendChild(item);
                    });
                }
            });
        } else if (type === 'library') {
            const availableComponents = ['Text', 'Button', 'Header'];
            availableComponents.forEach(type => {
                const item = document.createElement('div');
                item.className = 'control-item';
                item.textContent = type;
                item.addEventListener('click', () => {
                    import('./viewport.js').then(({ addComponent }) => {
                        addComponent(type);
                    });
                });
                panel.appendChild(item);
            });
        }
    }

    // Tap-off-to-close functionality
    document.addEventListener('click', (event) => {
        const panel = document.getElementById('control-panel');
        const bar = document.getElementById('control-bar');
        if (!panel.contains(event.target) && !bar.contains(event.target) && panel.classList.contains('open')) {
            panel.classList.remove('open');
            isOpen = false;
            currentPanel = null;
        }
    });
}