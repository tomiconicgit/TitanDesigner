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
        width: 100vw;
        height: 100vh;
        background-color: #000000;
        position: relative;
        overflow: hidden;
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