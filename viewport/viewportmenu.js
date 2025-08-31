const layoutStyles = `
    #control-bar {
        position: fixed;
        top: 0; /* Moved to top of page */
        left: 0;
        right: 0;
        width: 100%; /* Touching left and right edges */
        height: 40px; /* Reduced vertical height */
        background: #000000; /* New color */
        border-bottom: 1px solid rgba(0, 0, 0, 0.2); /* Changed to bottom border for top placement */
        display: flex;
        justify-content: flex-end;
        align-items: center;
        z-index: 1002;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4); /* Top drop shadow */
        transition: background-color 0.2s ease;
    }

    #control-bar.dark {
        background: #0A0A0A;
    }

    .menu-icon {
        width: 30px;
        height: 20px;
        margin-right: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
    }

    .menu-line {
        width: 100%;
        height: 3px;
        background-color: #F8F9FA; /* Off-white lines */
        transition: background-color 0.2s ease;
    }

    .menu-line.dark {
        background-color: #E9ECEF;
    }

    #control-panel {
        position: fixed;
        right: -100%; /* Start fully off-screen right */
        top: 0;
        width: 100%; /* Expanded to touch right side */
        height: 100dvh; /* Full height */
        background-color: #111111; /* Panel background */
        padding: 20px;
        box-sizing: border-box;
        transition: right 0.8s ease-out, opacity 0.3s ease; /* Slide and fade */
        z-index: 1001;
        overflow-y: auto;
        box-shadow: -2px 0 6px rgba(0, 0, 0, 0.4); /* Drop shadow on left */
    }

    #control-panel.dark {
        background-color: #0F0F0F;
    }

    #control-panel.open {
        right: 0; /* Touch right side */
    }

    #control-panel .header {
        background-color: #000000; /* Header color */
        padding: 10px;
        margin: -20px -20px 20px -20px; /* Extend to panel edges */
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Bottom drop shadow */
    }

    #control-panel .header h3 {
        color: #F8F9FA; /* Off-white text */
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
        transition: background-color 0.2s ease, opacity 0.3s ease; /* Fade transition */
        opacity: 0; /* Initially hidden */
    }

    .control-item.active {
        opacity: 1; /* Fade in when active */
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
 * Initializes the control panel with a fixed top bar and sliding full-screen panel with fade transitions.
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

    // Initialize top bar with menu icon
    let isOpen = false;
    let currentPanel = null;
    const menuIcon = document.createElement('div');
    menuIcon.className = 'menu-icon';
    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.className = 'menu-line';
        menuIcon.appendChild(line);
    }
    menuIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        panel.classList.toggle('open', isOpen);
        if (isOpen) {
            currentPanel = 'menu'; // Initial state
            showPanel(currentPanel);
        } else {
            currentPanel = null;
        }
    });
    controlBar.appendChild(menuIcon);

    function showPanel(type) {
        panel.innerHTML = '';
        const header = document.createElement('div');
        header.className = 'header';
        const title = document.createElement('h3');
        title.textContent = 'Menu';
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

        if (type === 'menu') {
            const options = ['Library', 'Layout'];
            options.forEach((opt, index) => {
                const item = document.createElement('div');
                item.className = 'control-item';
                item.textContent = opt; // Off-white text for Library and Layout
                item.dataset.type = opt.toLowerCase();
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentPanel = item.dataset.type;
                    showPanel(currentPanel);
                });
                panel.appendChild(item);
                if (index < options.length - 1) {
                    const divider = document.createElement('div');
                    divider.className = 'panel-divider';
                    panel.appendChild(divider);
                }
            });
        } else if (type === 'library') {
            const availableComponents = ['Text', 'Button', 'Header'];
            availableComponents.forEach((component, index) => {
                const item = document.createElement('div');
                item.className = 'control-item active'; // Fade in
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
        } else if (type === 'layout') {
            const sections = ['Device', 'Orientation', 'Colour Scheme', 'Dynamic Type', 'Preview Mode'];
            sections.forEach((section, index) => {
                const item = document.createElement('div');
                item.className = 'control-item active'; // Fade in
                item.textContent = section;
                item.addEventListener('click', () => {
                    if (section === 'Device') {
                        import('./viewport.js').then(({ updateAspectRatio }) => {
                            updateAspectRatio('430 / 932'); // Example, adjust as needed
                        });
                    }
                    // Add other section handlers as needed
                });
                panel.appendChild(item);
                if (index < sections.length - 1) {
                    const divider = document.createElement('div');
                    divider.className = 'panel-divider';
                    panel.appendChild(divider);
                }
            });
        }

        // Fade out inactive items
        const items = panel.getElementsByClassName('control-item');
        for (let item of items) {
            if (!item.classList.contains('active')) {
                item.style.opacity = '0';
            }
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