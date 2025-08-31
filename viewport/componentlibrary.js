const libraryStyles = `
    #library-toggle {
        position: fixed;
        top: 170px; /* Position below layouts tab */
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
        top: 170px; /* Align with tab */
        left: -400px; /* Start fully off-screen left */
        width: 400px;
        height: 200px;
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
        overflow-x: auto;
    }

    #library-panel.open {
        left: -200px; /* Slide in halfway (400px / 2) */
    }

    .library-option {
        display: inline-block;
        padding: 10px;
        margin: 5px;
        background-color: rgba(34, 34, 34, 0.7); /* Darker glassmorphic button */
        backdrop-filter: blur(10px);
        border: 1px solid rgba(68, 68, 68, 0.5);
        border-radius: 5px;
        cursor: pointer;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .library-option:hover {
        background-color: rgba(51, 51, 51, 0.8);
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
    });

    // Populate panel with component options
    availableComponents.forEach(type => {
        const option = document.createElement('div');
        option.className = 'library-option';
        option.textContent = type;
        option.addEventListener('click', () => {
            import('./viewport.js').then(({ addComponent }) => {
                addComponent(type);
                panel.classList.remove('open'); // Close panel after addition
            });
        });
        panel.appendChild(option);
    });
}