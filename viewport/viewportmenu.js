const layoutStyles = `
    #control-bar {
        position: fixed;
        bottom: 10px; /* Small offset below viewport */
        left: 10px; /* Tiny gap on left */
        right: 10px; /* Tiny gap on right */
        width: calc(100% - 20px); /* Adjust for left and right gaps */
        height: 80px; /* Compact height */
        background: #000E1C; /* New color */
        border: 1px solid rgba(0, 0, 0, 0.2);
        display: flex;
        justify-content: space-around;
        align-items: center;
        z-index: 1002;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4); /* Drop shadow */
        transition: background-color 0.2s ease;
    }

    #control-bar.dark {
        background: #000A14;
    }

    .control-option {
        width: 100px;
        height: 50px;
        background-color: transparent;
        color: #F8F9FA; /* Off-white text */
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.1s ease, background-color 0.1s ease; /* Quick transition */
    }

    .control-option:active {
        background-color: #F8F9FA; /* Off-white highlight on press */
        color: #000E1C; /* Dark text on highlight */
    }

    .control-option.dark {
        color: #F8F9FA;
    }

    .control-option.dark:active {
        background-color: #F8F9FA;
        color: #000A14;
    }

    #control-panel {
        position: fixed;
        left: -200px; /* Start fully off-screen left */
        top: 0;
        width: 200px; /* 5:10 aspect ratio, height will be 400px */
        height: 400px; /* 5:10 aspect ratio of 200px width */
        background-color: #000E1C; /* Panel background */
        padding: 20px;
        box-sizing: border-box;
        transition: left 0.8s ease-out; /* Smooth slide-in with slowdown */
        z-index: 1001;
        overflow-y: auto;
        box-shadow: 2px 0 6px rgba(0, 0, 0, 0.4); /* Drop shadow on right */
        border-radius: 2px; /* Subtle 2px curve */
    }

    #control-panel.dark {
        background-color: #000A14;
    }

    #control-panel.open {
        left: 0; /* Slide in fully against left edge */
    }

    #control-panel .header {
        background-color: #000A14; /* Darker header (a few shades less) */
        padding: 10px;
        margin: -20px -20px 20px -20px; /* Extend to panel edges */
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 2px 2px 0 0; /* Match top corners */
    }

    #control-panel .header h3 {
        color: #0481FF; /* Title color */
        font-size: 14px;
        font-weight: bold;
        margin: 0;
    }

    #control-panel .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: #F8F9FA; /* Off-white X */
        font-size: 18px;
        padding: 5px;
    }

    #control-panel .close-btn:hover {
        color: #E9ECEF; /* Slightly lighter off-white on hover */
    }

    .control-section {
        margin-bottom: 10px;
    }

    .control-item {
        padding: 8px;
        cursor: pointer;
        color: #F8F9FA; /* Off-white text */
        transition: background-color 0.2s ease;
    }

    .control-item:hover {
        background-color: rgba(248, 249, 250, 0.1); /* Off-white hover */
    }

    .panel-divider {
        width: 100%;
        height: 1px;
        background-color: #F8F9FA; /* Off-white divider */
        margin: 8px 0;
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
 * Initializes the control panel with a floating bottom bar and sliding left panel with dividers.
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

    // Initialize bottom bar with options
    let isOpen = false;
    let currentPanel = null;
    const options = [
        { name: 'Library', label: 'Library' },
        { name: 'Layouts', label: 'Layouts' }
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
            sections.forEach((section, index) => {
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
                if (index < sections.length - 1) {
                    const divider = document.createElement('div');
                    divider.className = 'panel-divider';
                    panel.appendChild(divider);
                }
            });
        } else if (type === 'library') {
            const availableComponents = ['Text', 'Button', 'Header'];
            availableComponents.forEach((component, index) => {
                const item = document.createElement('div');
                item.className = 'control-item';
                item.textContent = component;
                item.addEventListener('click', () => {
                    import('./viewport.js').then(({ addComponent }) => {
                        addComponent(component);
                    });
                });
                panel.appendChild(item);
                if (index < availableComponents.length - 1) {
                    const divider = document.createElement('div');
                    divider.className = 'panel-divider';
                    panel.appendChild(divider);
                }
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