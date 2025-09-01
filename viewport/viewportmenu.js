const layoutStyles = `
    #control-bar {
        position: fixed;
        top: -50px; /* Above viewport, adjustable */
        left: 0;
        right: 0;
        width: 200px;
        height: 50px;
        background: #28282B; /* Flat color */
        border-radius: 10px 10px 0 0; /* Curved corners at top */
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        box-sizing: border-box;
        z-index: 1002;
        transition: top 0.3s ease;
    }

    #control-bar.open {
        top: 0; /* Slide down when open */
    }

    .menu-text {
        color: #FFFFFF; /* White text */
        font-size: 16px;
        font-weight: bold;
    }

    .dropdown-icon {
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #FFFFFF; /* White down triangle */
        transition: transform 0.3s ease;
    }

    #control-bar.open .dropdown-icon {
        transform: rotate(180deg); /* Rotate up when open */
    }

    #dropdown {
        position: fixed;
        top: 50px; /* Below menu button */
        left: 0;
        right: 0;
        width: 200px;
        background: #28282B;
        border-radius: 0 0 10px 10px; /* Curved corners at bottom */
        display: none;
        flex-direction: column;
        padding: 5px 0;
        z-index: 1001;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    #dropdown.open {
        display: flex;
    }

    .dropdown-item {
        color: #FFFFFF; /* White text */
        font-size: 14px;
        padding: 10px 15px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .dropdown-item:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    #control-panel {
        position: fixed;
        bottom: -40%; /* Start fully off-screen bottom */
        left: 0;
        width: 100%;
        height: 40%; /* 40% of viewport height */
        background-color: #1C1B1C; /* Panel background */
        padding: 20px;
        box-sizing: border-box;
        transition: bottom 0.8s ease-out;
        z-index: 1000;
        overflow-y: auto;
    }

    #control-panel.open {
        bottom: 0; /* Slide up fully */
    }

    .control-button {
        width: 100%;
        height: 50px;
        background: #28282B;
        color: #FFFFFF; /* White text */
        font-size: 16px;
        border: none;
        border-radius: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .control-button:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .control-button:last-child {
        margin-bottom: 0;
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
 * Initializes the control panel with a top menu button, dropdown, and sliding library panel.
 */
export function initViewportLayouts() {
    const styleElement = document.createElement('style');
    styleElement.textContent = layoutStyles;
    document.head.appendChild(styleElement);

    // Control bar (menu button)
    const controlBar = document.createElement('div');
    controlBar.id = 'control-bar';
    const menuText = document.createElement('div');
    menuText.className = 'menu-text';
    menuText.textContent = 'Menu';
    const dropdownIcon = document.createElement('div');
    dropdownIcon.className = 'dropdown-icon';
    controlBar.appendChild(menuText);
    controlBar.appendChild(dropdownIcon);
    document.body.appendChild(controlBar);

    // Dropdown
    const dropdown = document.createElement('div');
    dropdown.id = 'dropdown';
    const dropdownOptions = ['Library', 'Layouts', 'Fullscreen'];
    dropdownOptions.forEach(opt => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = opt;
        item.addEventListener('click', () => {
            controlBar.classList.remove('open');
            dropdown.classList.remove('open');
            if (opt === 'Library') {
                showLibraryPanel();
            }
            // Add Layouts and Fullscreen handlers as needed
        });
        dropdown.appendChild(item);
    });
    document.body.appendChild(dropdown);

    // Control panel (library panel)
    const panel = document.createElement('div');
    panel.id = 'control-panel';
    document.body.appendChild(panel);

    // Sync theme with viewport
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.classList.contains('dark') ? controlBar.classList.add('dark') : controlBar.classList.remove('dark');
    }

    // Toggle menu
    let isMenuOpen = false;
    controlBar.addEventListener('click', (e) => {
        e.stopPropagation();
        isMenuOpen = !isMenuOpen;
        controlBar.classList.toggle('open', isMenuOpen);
        dropdown.classList.toggle('open', isMenuOpen);
    });

    // Close dropdown on outside click
    document.addEventListener('click', (event) => {
        if (!controlBar.contains(event.target) && !dropdown.contains(event.target)) {
            controlBar.classList.remove('open');
            dropdown.classList.remove('open');
            isMenuOpen = false;
        }
    });

    function showLibraryPanel() {
        panel.innerHTML = '';
        const buttons = ['Button', 'Header', 'Bottom Bar', 'Container', 'Text'];
        buttons.forEach(buttonText => {
            const button = document.createElement('button');
            button.className = 'control-button';
            button.textContent = buttonText;
            button.addEventListener('click', () => {
                import('./viewport.js').then(({ addComponent }) => {
                    addComponent(buttonText); // Add component to canvas
                });
                panel.classList.remove('open'); // Close panel
            });
            panel.appendChild(button);
        });
        panel.classList.add('open');
    }
}