const canvasStyles = `
    #canvas-container {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    }

    #canvas {
        width: 100%;
        height: auto;
        max-width: 306px; /* Reduced to 90% of 340px for more room */
        background-color: #000000;
        border: 8px solid #424242; /* Realistic iPhone frame */
        border-radius: 40px; /* Rounded corners like iPhone */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3); /* Realistic shadow */
        position: relative;
        overflow: hidden;
        aspect-ratio: 430 / 932; /* Default to iPhone 15 Pro Max */
        transition: transform 0.3s ease; /* For orientation changes */
    }

    #canvas.dark {
        background-color: #1c1c1e; /* Dark mode background */
        color: #ffffff; /* Adjust text color for dark mode */
    }

    #canvas.large-text {
        font-size: 1.2em; /* Dynamic type: larger text */
    }

    #canvas.selectable {
        pointer-events: auto; /* Selectable mode: allow interactions */
    }
`;

/**
 * Creates the canvas viewport component and appends it to a parent element.
 * @param {HTMLElement} parentElement The DOM element to attach the canvas to.
 */
export function createCanvas(parentElement) {
    if (!document.head || !parentElement) {
        console.error("Document head or parent element not available.");
        return;
    }
    const styleElement = document.createElement('style');
    styleElement.textContent = canvasStyles;
    document.head.appendChild(styleElement);

    const canvasContainer = document.createElement('div');
    canvasContainer.id = 'canvas-container';

    const canvas = document.createElement('div');
    canvas.id = 'canvas';
    canvas.classList.add('live'); // Default to live mode (interactive)

    canvasContainer.appendChild(canvas);
    parentElement.appendChild(canvasContainer);
}

/**
 * Adds a new component to the canvas from the library.
 * @param {string} type The component type (e.g., 'Text', 'Button').
 */
export function addComponent(type) {
    import('../engine/layoutschema.js').then(({ generateId }) => {
        import(`./components/${type.toLowerCase()}.js`).then(({ createComponentTemplate }) => {
            const template = createComponentTemplate();
            template.id = generateId();
            import('../engine/layoutschema.js').then(({ addComponent }) => {
                addComponent(template);
                import('../engine/renderer.js').then(({ render }) => render());
            }).catch(error => console.error("Error adding component to schema:", error));
        }).catch(error => console.error("Error loading component template:", error));
    }).catch(error => console.error("Error importing layout schema:", error));
}

/**
 * Updates a component's properties on the canvas.
 * @param {string} id The component ID.
 * @param {Object} props The updated props.
 */
export function updateComponentProps(id, props) {
    import('../engine/layoutschema.js').then(({ getComponents, updateComponent }) => {
        const components = getComponents();
        const component = components.find(c => c.id === id);
        if (component) {
            Object.assign(component.props, props);
            updateComponent(component);
            import('../engine/renderer.js').then(({ render }) => render());
        }
    }).catch(error => console.error("Error updating component props:", error));
}

// Re-export existing functions with British spelling
export function updateAspectRatio(ratio) {
    const canvas = document.getElementById('canvas');
    if (canvas) {
        const [width, height] = ratio.split('/').map(Number);
        const scaleFactor = 0.85; // Reduced to 85% (15% reduction)
        const baseWidth = 306; // Based on max-width
        const scaledWidth = baseWidth * scaleFactor;
        const scaledHeight = (scaledWidth * height) / width;
        canvas.style.width = `${scaledWidth}px`;
        canvas.style.height = `${scaledHeight}px`;
        canvas.style.aspectRatio = ratio; // Ensure aspect ratio is maintained
    }
}

export function updateOrientation(orient) {
    const canvas = document.getElementById('canvas');
    if (canvas) canvas.style.transform = orient === 'landscape' ? 'rotate(90deg)' : 'rotate(0deg)';
}

export function updateColourScheme(scheme) {
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.classList.toggle('dark', scheme === 'dark');
        canvas.classList.toggle('light', scheme === 'light');
    }
}

export function updateDynamicType(type) {
    const canvas = document.getElementById('canvas');
    if (canvas) canvas.classList.toggle('large-text', type === 'large');
}

export function updatePreviewMode(mode) {
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.classList.toggle('live', mode === 'live');
        canvas.classList.toggle('selectable', mode === 'selectable');
    }
}