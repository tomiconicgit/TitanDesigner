// This string contains all the CSS needed to style the canvas builder.
const canvasStyles = `
    /* Container for the iPhone Canvas */
    #canvas-container {
        width: 100%;
        flex-grow: 1; /* This makes it fill the available space in its parent */
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 15px;
        box-sizing: border-box;
    }

    /* The iPhone Canvas */
    #canvas {
        width: 100%;
        height: 100%;
        max-width: 430px;
        max-height: 932px;
        background-color: #000000;
        border: 8px solid #424242;
        border-radius: 50px;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
        position: relative;
        overflow: hidden;
        /* Maintain a phone-like aspect ratio */
        aspect-ratio: 9 / 19.5;
    }
`;

/**
 * Creates the canvas builder component and appends it to a parent element.
 * It also injects the necessary CSS into the document's head.
 * @param {HTMLElement} parentElement The DOM element to attach the canvas to.
 */
export function createCanvas(parentElement) {
    // 1. Inject the CSS styles into the document's <head>.
    // This ensures the styles are available globally for our component.
    const styleElement = document.createElement('style');
    styleElement.textContent = canvasStyles;
    document.head.appendChild(styleElement);

    // 2. Create the HTML elements programmatically.
    const canvasContainer = document.createElement('div');
    canvasContainer.id = 'canvas-container';

    const canvas = document.createElement('div');
    canvas.id = 'canvas';

    // 3. Assemble the component.
    canvasContainer.appendChild(canvas);

    // 4. Append the fully assembled component to the specified parent element.
    parentElement.appendChild(canvasContainer);
}
