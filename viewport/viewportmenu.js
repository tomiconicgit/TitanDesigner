const layoutStyles = `
    #control-bar {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 50px;
        background: linear-gradient(to bottom, #1E1E1E, #0A0A0A); /* Black gradient */
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 25px; /* Pill shape */
        display: flex;
        align-items: center;
        justify-content: space-around;
        z-index: 1002;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Slight drop shadow */
        transition: background-color 0.2s ease;
    }

    #control-bar.dark {
        background: linear-gradient(to bottom, #1c1c1e, #0A0A0A);
    }

    .control-option {
        width: 90px;
        height: 40px;
        background-color: transparent;
        color: #FFFFFF; /* White text */
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.1s ease, background-color 0.1s ease; /* Quick transition */
    }

    .control-option:active {
        background-color: #FFFFFF; /* White highlight on press */
        color: #0A0A0A; /* Dark text on highlight */
    }

    .control-option.dark {
        color: #FFFFFF;
    }

    .control-option.dark:active {
        background-color: #FFFFFF;
        color: #0A0A0A;
    }

    .divider {
        width: 1px;
        height: 30px;
        background-color: rgba(255, 255, 255, 0.2); /* White divider */
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

    #control-panel .header {
        background-color: #1A1A1A; /* Darker header */
        padding: 10px;
        margin: -20px -20px 20px -20px; /* Extend to panel edges */
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    #control-panel .header h3 {
        color: #FFFFFF;
        font-size: 14px;
        font-weight: bold;
        margin: 0;
    }

    #control-panel .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: #FFFFFF;
        font-size: 18px;
        padding: 5px;
    }

    #control-panel .close-btn:hover {
        color: #CCCCCC;
    }

    .control-section {
        margin-bottom: 20px;
    }

    .control-item {
        padding: 10px;
        cursor: pointer;
        color: #FFFFFF;
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
        const header = document.createElement('div');
        header.className = 'header';
        const title = document.createElement('h3');
        title.textContent = type.toUpperCase();
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12L12 4M12 12L4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; // X icon
        closeBtn.addEventListener('click', () => {
            panel.classList.remove('open');
            isOpen = false;
            currentPanel = null;
        });
        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);

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