const canvasStyles = `
    #canvas-container {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 15px; /* Increased padding to add a bit more space from the sides */
        box-sizing: border-box;
    }

    #canvas {
        width: 100%;
        height: auto;
        max-width: 340px; /* Reduced max-width to make the canvas slightly smaller */
        background-color: #000000;
        border: 8px solid #424242; /* Realistic iPhone frame color */
        border-radius: 50px; /* Rounded corners like iPhone */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3); /* Enhanced realistic shadow */
        position: relative;
        overflow: hidden;
        aspect-ratio: 131 / 284; /* Default to iPhone 16 ratio */
    }
`;

/**
 * Creates the canvas builder component and appends it to a parent element.
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

    canvasContainer.appendChild(canvas);
    parentElement.appendChild(canvasContainer);
}

// Export function to update aspect ratio (called from canvasbuilderlayouts.js)
export function updateCanvasAspectRatio(ratio) {
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.style.aspectRatio = ratio;
    }
}