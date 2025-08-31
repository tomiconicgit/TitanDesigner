const layoutStyles = `
    #control-toggle {
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
        background-color: rgba(255, 255, 255, 0.9); /* Light theme */
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        color: #007aff; /* iOS system blue */
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1001;
        transition: background-color 0.2s ease, color 0.2s ease;
    }

    #control-toggle.dark {
        background-color: rgba(28, 28, 30, 0.9);
        border-color: rgba(255, 255, 255, 0.1);
    }

    #control-toggle:hover {
        background-color: rgba(0, 122, 255, 0.1);
        color: #005bb5;
    }

    #control-panel {
        position: fixed;
        bottom: -300px; /* Start fully off-screen bottom */
        left: 0;
        width: 100%;
        max-height: 300px; /* Fixed height for bottom panel */
        background-color: #2E2E2E; /* Match Xcode background */
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        padding: 10px;
        box-sizing: border-box;
        transition: bottom 1.0s cubic-bezier(0.4, 0.0, 0.2, 1); /* Slower, smoother slide up */
        z-index: 1000;
        overflow-y: auto;
        box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
    }

    #control-panel.dark {
        background-color: #1c1c1e;
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
    }

    #control-panel.open {
        bottom: 0; /* Slide up to bottom edge */
    }

    #control-panel.expanded {
        max-height: calc(50vh - 20px); /* Half screen height with padding */
    }

    .control-option {
        display: inline-block;
        width: 40px;
        height: 40px;
        padding: 5px;
        margin: 5px;
        background-color: #f5f5f5;
        color: #333333;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        cursor: pointer;
        text-align: center;
        line-height: 30px;
        font-size: 20px;
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

    .control-section {
        margin-bottom: 15px;
        display: flex;
        justify-content: center;
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
 * Initializes the control panel with Xcode-like compact layout at the bottom.
 */
export function initViewportLayouts() {
    const styleElement = document.createElement('style');
    styleElement.textContent = layoutStyles;
    document.head.appendChild(styleElement);

    // Toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'control-toggle';
    toggleButton.textContent = '▲'; // Up arrow to indicate sliding up
    document.body.appendChild(toggleButton);

    // Control panel
    const panel = document.createElement('div');
    panel.id = 'control-panel';
    document.body.appendChild(panel);

    // Sync theme with viewport
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.classList.contains('dark') ? panel.classList.add('dark') : panel.classList.remove('dark');
        toggleButton.classList.toggle('dark', canvas.classList.contains('dark'));
    }

    // Initial small panel with icon options
    let isOpen = false;
    let currentPanel = null; // Track the current panel type
    toggleButton.addEventListener('click', () => {
        isOpen = !isOpen;
        panel.classList.toggle('open', isOpen);
        if (isOpen && !panel.classList.contains('expanded')) {
            showInitialOptions();
            panel.classList.remove('expanded');
            currentPanel = null; // Reset current panel on toggle open
        } else if (!isOpen) {
            panel.classList.remove('expanded');
            currentPanel = null; // Reset on close
        }
    });

    function showInitialOptions() {
        panel.innerHTML = ''; // Clear previous content
        const options = [
            { name: 'Layouts', icon: '⧉' }, // Layout grid icon
            { name: 'Library', icon: '📚' }  // Library book icon
        ];
        options.forEach(opt => {
            const option = document.createElement('div');
            option.className = 'control-option';
            option.textContent = opt.icon;
            option.dataset.type = opt.name.toLowerCase();
            option.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent tap-off from closing immediately
                panel.classList.add('expanded');
                currentPanel = opt.name.toLowerCase();
                showPanel(currentPanel);
            });
            panel.appendChild(option);
        });
    }

    function showPanel(type) {
        panel.innerHTML = ''; // Clear previous content
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
                                if (scheme === 'dark') {
                                    panel.classList.add('dark');
                                    toggleButton.classList.add('dark');
                                } else {
                                    panel.classList.remove('dark');
                                    toggleButton.classList.remove('dark');
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
                            });
                        });
                        sectionDiv.appendChild(option);
                    });
                } else if (section === 'Preview Mode') {
                    ['Live', 'Selectable'].forEach(mode => {
                        const option = document.createElement('div');
                        option.classList.add('control-option');
                        option.textContent = mode;
                        option.addEventListener('click', () => {
                            import('./viewport.js').then(({ updatePreviewMode }) => {
                                updatePreviewMode(mode.toLowerCase());
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
                    });
                });
                panel.appendChild(option);
            });
        }
    }

    // Tap-off-to-close functionality
    document.addEventListener('click', (event) => {
        const panel = document.getElementById('control-panel');
        const toggle = document.getElementById('control-toggle');
        if (!panel.contains(event.target) && !toggle.contains(event.target) && panel.classList.contains('open')) {
            panel.classList.remove('open');
            panel.classList.remove('expanded');
            isOpen = false;
            currentPanel = null; // Reset current panel on close
        }
    });
}