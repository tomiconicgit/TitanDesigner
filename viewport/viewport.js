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
        max-width: 340px; /* Balanced size for building */
        background-color: #000000;
        border: 8px solid #424242; /* Realistic iPhone frame */
        border-radius: 40px; /* Rounded corners like iPhone */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3); /* Realistic shadow */
        position: relative;
        overflow: hidden;
        aspect-ratio: 430 / 932; /* Default to iPhone 15 Pro Max (full resolution ratio) */
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
 * Updates the canvas aspect ratio based on selected device.
 * @param {string} ratio The aspect ratio string (e.g., '430 / 932').
 */
export function updateAspectRatio(ratio) {
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.style.aspectRatio = ratio;
    }
}

/**
 * Updates the canvas orientation (portrait/landscape).
 * @param {string} orientation 'portrait' or 'landscape'.
 */
export function updateOrientation(orientation) {
    const canvas = document.getElementById('canvas');
    if (canvas) {
        if (orientation === 'landscape') {
            canvas.style.transform = 'rotate(90deg)';
            const [width, height] = canvas.style.aspectRatio.split(' / ').map(Number);
            canvas.style.aspectRatio = `${height} / ${width}`;
        } else {
            canvas.style.transform = 'rotate(0deg)';
        }
    }
}

/**
 * Updates the color scheme (light/dark).
 * @param {string} scheme 'light' or 'dark'.
 */
export function updateColorScheme(scheme) {
    const canvas = document.getElementById('canvas');
    if (canvas) {
        if (scheme === 'dark') {
            canvas.classList.add('dark');
        } else {
            canvas.classList.remove('dark');
        }
    }
}

/**
 * Updates dynamic type (font size).
 * @param {string} type 'small' or 'large'.
 */
export function updateDynamicType(type) {
    const canvas = document.getElementById('canvas');
    if (canvas) {
        if (type === 'large') {
            canvas.classList.add('large-text');
        } else {
            canvas.classList.remove('large-text');
        }
    }
}

/**
 * Updates preview mode (live/selectable).
 * @param {string} mode 'live' or 'selectable'.
 */
export function updatePreviewMode(mode) {
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.classList.remove('live', 'selectable');
        canvas.classList.add(mode);
    }
}