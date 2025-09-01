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

// NEW: Added styles for all UI components
const componentStyles = `
    :root {
        --panel-color: #1c1c1e;
        --border-color: #3a3a3c;
        --primary-blue: #0a84ff;
        --text-color: #ffffff;
    }
    .draggable { border: 1px dashed transparent; }
    .draggable.selected { border-color: var(--primary-blue); }

    .ui-button { background-color: var(--primary-blue); color: white; border-radius: 8px; padding: 10px 20px; font-size: 16px; display: flex; align-items: center; justify-content: center; }
    .ui-text { color: white; padding: 5px; height: auto; width: auto; background: transparent; display: flex; align-items: center; justify-content: center; }
    .ui-container { background-color: rgba(44, 44, 46, 0.2); border: 1px solid var(--border-color); border-radius: 12px; }
    .ui-header { background: var(--panel-color); color: white; display: flex; align-items: center; justify-content: center; }
    .ui-bottombar { background: var(--panel-color); color: white; display: flex; align-items: center; justify-content: center; }
    .ui-input { background-color: transparent; }
    .ui-input input { width: 100%; height: 100%; background-color: var(--panel-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0 12px; color: var(--text-color); font-size: 16px; pointer-events: none; box-sizing: border-box; }
    .ui-image { background-color: var(--panel-color); border-radius: 12px; overflow: hidden; }
    .ui-image img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
    .ui-card { background-color: var(--panel-color); border-radius: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
    .ui-avatar { background-color: var(--panel-color); border-radius: 50%; overflow: hidden; }
    .ui-avatar img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
    .ui-icon { display: flex; align-items: center; justify-content: center; }
    .ui-icon svg { width: 100%; height: 100%; fill: #8e8e93; }
`;

/**
 * Creates the iPhone viewport and the canvas within it.
 * @param {HTMLElement} parentElement The DOM element to attach the viewport to.
 */
export function initViewport(parentElement) {
    // Inject iPhone frame styles
    const iphoneStyleElement = document.createElement('style');
    iphoneStyleElement.textContent = iphoneStyles;
    document.head.appendChild(iphoneStyleElement);
    
    // Inject UI component styles
    const componentStyleElement = document.createElement('style');
    componentStyleElement.textContent = componentStyles;
    document.head.appendChild(componentStyleElement);

    const iphoneFrame = document.createElement('div');
    iphoneFrame.id = 'iphone-frame';

    const iphoneScreen = document.createElement('div');
    iphoneScreen.id = 'iphone-screen';

    const dynamicIsland = document.createElement('div');
    dynamicIsland.id = 'dynamic-island';

    const canvas = document.createElement('div');
    canvas.id = 'canvas';
    canvas.classList.add('selectable');

    iphoneScreen.appendChild(dynamicIsland);
    iphoneScreen.appendChild(canvas);
    iphoneFrame.appendChild(iphoneScreen);
    parentElement.appendChild(iphoneFrame);
}
