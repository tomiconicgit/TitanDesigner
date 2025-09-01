const iphoneStyles = `
    :root { --iphone-radius: 54px; }
    #iphone-frame {
        width: 100%;
        max-width: 320px; 
        aspect-ratio: 1179 / 2556;
        background: #000;
        border: 8px solid #222;
        border-radius: var(--iphone-radius);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 0 5px rgba(255,255,255,0.1);
        position: relative;
        padding: 10px;
        flex-shrink: 0;
    }
    #iphone-screen {
        width: 100%; height: 100%;
        background: #000;
        border-radius: calc(var(--iphone-radius) - 10px);
        position: relative;
        overflow: hidden;
    }
    #dynamic-island {
        position: absolute; top: 10px; left: 50%;
        transform: translateX(-50%);
        width: 100px; height: 25px;
        background: #000;
        border-radius: 20px;
        z-index: 100;
    }
    #canvas {
        width: 100%; height: 100%;
        position: relative;
    }
`;

/**
 * Creates the iPhone viewport and the canvas within it.
 * @param {HTMLElement} parentElement The DOM element to attach the viewport to.
 */
export function initViewport(parentElement) {
    const styleElement = document.createElement('style');
    styleElement.textContent = iphoneStyles;
    document.head.appendChild(styleElement);

    const iphoneFrame = document.createElement('div');
    iphoneFrame.id = 'iphone-frame';

    const iphoneScreen = document.createElement('div');
    iphoneScreen.id = 'iphone-screen';

    const dynamicIsland = document.createElement('div');
    dynamicIsland.id = 'dynamic-island';

    const canvas = document.createElement('div');
    canvas.id = 'canvas';
    // The 'selectable' class is now controlled by your interactions.js logic
    // We add it here to enable interactions by default.
    canvas.classList.add('selectable');

    iphoneScreen.appendChild(dynamicIsland);
    iphoneScreen.appendChild(canvas);
    iphoneFrame.appendChild(iphoneScreen);
    parentElement.appendChild(iphoneFrame);
}
