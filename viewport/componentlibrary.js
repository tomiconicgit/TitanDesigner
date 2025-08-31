const libraryStyles = `
    #library-toggle {
        position: fixed;
        top: calc(50px + 120px); /* Fixed position below viewport toggle */
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

    #library-panel {
        position: fixed;
        top: 50%; /* Center vertically */
        left: -350px; /* Start fully off-screen left, match layouts width */
        width: 350px; /* Standardized width to match layouts */
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

    #library-panel.open {
        left: 0; /* Slide fully on-screen to show all buttons */
    }

    .library-option {
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

    .library-option:hover {
        background-color: rgba(230, 230, 230, 0.9); /* Lighter off-white on hover */
    }
`;

const availableComponents = ['Text', 'Button', 'Header']; // Add more as files are created

/**
 * Initializes the component library toolbar.
 */
export function initComponentLibrary() {
    const styleElement = document.createElement('style');
    styleElement.textContent = libraryStyles;
    document.head.appendChild(styleElement);

    const toggleButton = document.createElement('button');
    toggleButton.id = 'library-toggle';
    toggleButton.textContent = 'L\nI\nB\nR\nA\nR\nY';
    document.body.appendChild(toggleButton);

    const panel = document.createElement('div');
    panel.id = 'library-panel';
    document.body.appendChild(panel);

    toggleButton.addEventListener('click', () => {
        panel.classList.toggle('open');
        if (panel.classList.contains('open')) {
            document.getElementById('viewport-panel')?.classList.remove('open'); // Close other panel
        }
    });

    // Populate panel with component options
    availableComponents.forEach(type => {
        const option = document.createElement('div');
        option.className = 'library-option';
        option.textContent = type;
        option.addEventListener('click', () => {
            import('./viewport.js').then(({ addComponent }) => {
                addComponent(type);
                panel.classList.remove('open');
            });
        });
        panel.appendChild(option);
    });

    // Tap-off-to-close functionality
    document.addEventListener('click', (event) => {
        const panel = document.getElementById('library-panel');
        const toggle = document.getElementById('library-toggle');
        if (!panel.contains(event.target) && !toggle.contains(event.target) && panel.classList.contains('open')) {
            panel.classList.remove('open');
        }
    });
}