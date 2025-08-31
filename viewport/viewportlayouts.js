const layoutStyles = `
    #control-toggle {
        position: fixed;
        top: 10px;
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
        transition: background-color 0.2s ease;
    }

    #control-toggle.dark {
        background-color: rgba(28, 28, 30, 0.9);
        border-color: rgba(255, 255, 255, 0.1);
    }

    #control-toggle:hover {
        background-color: rgba(0, 122, 255, 0.1);
        color: #005bb5;
    }

    #control-sidebar {
        position: fixed;
        top: 0;
        right: -250px;
        width: 250px;
        height: 100vh;
        background-color: #ffffff; /* Light theme */
        border-left: 1px solid rgba(0, 0, 0, 0.1);
        padding: 10px;
        box-sizing: border-box;
        transition: right 0.3s ease;
        z-index: 1000;
        overflow-y: auto;
        box-shadow: -2px 0 6px rgba(0, 0, 0, 0.1);
    }

    #control-sidebar.dark {
        background-color: #1c1c1e;
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
    }

    #control-sidebar.open {
        right: 0;
    }

    .control-section {
        margin-bottom: 15px;
    }

    .control-option {
        display: block;
        width: 100%;
        height: 30px;
        padding: 5px;
        margin: 5px 0;
        background-color: #f5f5f5;
        color: #333333;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        cursor: pointer;
        text-align: left;
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
 * Initializes the control sidebar with Xcode-like compact layout.
 */
export function initViewportLayouts() {
    const styleElement = document.createElement('style');
    styleElement.textContent = layoutStyles;
    document.head.appendChild(styleElement);

    // Toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'control-toggle';
    toggleButton.textContent = '☰'; // Hamburger icon
    document.body.appendChild(toggleButton);

    // Control sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'control-sidebar';
    document.body.appendChild(sidebar);

    // Sync theme with viewport
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.classList.contains('dark') ? sidebar.classList.add('dark') : sidebar.classList.remove('dark');
        toggleButton.classList.toggle('dark', canvas.classList.contains('dark'));
    }

    function showPanel(type) {
        sidebar.innerHTML = ''; // Clear previous content
        sidebar.classList.add('open');
        if (type === 'layouts') {
            const sections = ['Device', 'Orientation', 'Colour Scheme', 'Dynamic Type', 'Preview Mode'];
            sections.forEach(section => {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'control-section';
                sectionDiv.innerHTML = `<h3>${section}</h3>`;
                sidebar.appendChild(sectionDiv);

                if (section === 'Device') {
                    Object.entries(deviceOptions).forEach(([name, ratio]) => {
                        const option = document.createElement('div');
                        option.className = 'control-option';
                        option.textContent = name.length > 15 ? name.substring(0, 15) + '...' : name;
                        option.addEventListener('click', () => {
                            import('./viewport.js').then(({ updateAspectRatio }) => {
                                updateAspectRatio(ratio);
                                sidebar.classList.remove('open');
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
                                sidebar.classList.remove('open');
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
                                sidebar.classList.remove('open');
                                if (scheme === 'dark') {
                                    sidebar.classList.add('dark');
                                    toggleButton.classList.add('dark');
                                } else {
                                    sidebar.classList.remove('dark');
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
                                sidebar.classList.remove('open');
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
                                sidebar.classList.remove('open');
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
                        sidebar.classList.remove('open');
                    });
                });
                sidebar.appendChild(option);
            });
        }
    }

    // Initial panel setup with a toggle mechanism
    let isOpen = false;
    toggleButton.addEventListener('click', () => {
        isOpen = !isOpen;
        sidebar.classList.toggle('open', isOpen);
        if (isOpen) {
            showPanel('layouts'); // Default to layouts on open
        }
    });

    // Tap-off-to-close functionality
    document.addEventListener('click', (event) => {
        const sidebar = document.getElementById('control-sidebar');
        const toggle = document.getElementById('control-toggle');
        if (!sidebar.contains(event.target) && !toggle.contains(event.target) && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            isOpen = false;
        }
    });
}