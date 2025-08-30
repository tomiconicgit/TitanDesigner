const canvasStyles = `
    #canvas-container {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 15px;
        box-sizing: border-box;
    }

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
        aspect-ratio: 9 / 19.5;
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
