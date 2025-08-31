const layoutStyles = `
    #viewport-toggle {
        position: fixed;
        top: 50px; /* Fixed position above center */
        left: 0;
        width: 40px;
        height: 120px; /* Tall enough for vertical text */
        background-color: rgba(26, 26, 26, 0.8); /* Dark glassmorphic base */
        backdrop-filter: blur(10px);
        color: #ffffff;
        border: 1px solid rgba(68, 68, 68, 0.5);
        border-left: none; /* No left border to attach to screen */
        border-right: 1px solid rgba(68, 68, 68, 0.5);
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        cursor: pointer;
        z-index: 1000;
        padding: 5px 0;
        white-space: pre;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    #viewport-panel {
        position: fixed;
        top: 50%; /* Center vertically */
        left: -350px; /* Start fully off-screen left */
        width: 350px; /* Standardized width */
        height: 490px; /* 5:7 aspect ratio with 350px width */
        transform: translateY(-50%); /* Center vertically */
        background-color: rgba(26, 26, 26, 0.8); /* Dark glassmorphic base */
        backdrop-filter: blur(15px);
        color: #ffffff;
        padding: 20px;
        box-sizing: border-box;
        border-left: none; /* No left border */
        border-right: 1px solid rgba(68, 68, 68, 0.5);
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        transition: left 0.3s ease; /* Slide in with tab */
        z-index: 1000;
        overflow-y: auto; /* Ensure all content is scrollable */
    }

    #viewport-panel.open {
        left: 0; /* Slide fully on-screen to show all buttons */
    }

    .viewport-option {
        display: inline-block;
        width: 100px; /* Neater, fixed width */
        height: 25px; /* Reduced height for compactness */
        padding: 5px; /* Adjusted padding for smaller height */
        margin: 5px 0;
        background-color: rgba(245, 245, 245, 0.9); /* Off-white background */
        backdrop-filter: blur(5px);
        color: #333333; /* Dark text for readability */
        border: 1px solid rgba(68, 68, 68, 0.3);
        border-radius: 5px;
        cursor: pointer;
        text-align: center;
        line-height: 15px; /* Adjusted for smaller height */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .viewport-option:hover {
        background-color: rgba(230, 230, 230, 0.9); /* Lighter off-white on hover */
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
        if (panel.classList.contains('open')) {
            document.getElementById('library-panel')?.classList.remove('open'); // Close other panel
        }
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
                option.textContent = name.length > 15 ? name.substring(0, 15) + '...' : name; // Truncate long names
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

    // Tap-off-to-close functionality
    document.addEventListener('click', (event) => {
        const panel = document.getElementById('viewport-panel');
        const toggle = document.getElementById('viewport-toggle');
        if (!panel.contains(event.target) && !toggle.contains(event.target) && panel.classList.contains('open')) {
            panel.classList.remove('open');
        }
    });
}