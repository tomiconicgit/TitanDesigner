const menuStyles = `
    :root {
        --bar-background: rgba(28, 28, 30, 0.8);
        --bar-border: rgba(80, 80, 80, 0.6);
    }
    #floating-bar {
        position: fixed;
        top: calc(env(safe-area-inset-top, 10px) + 10px);
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 450px;
        height: 50px;
        background: var(--bar-background);
        border: 1px solid var(--bar-border);
        border-radius: 16px;
        z-index: 9000;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0 10px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
    }
    .bar-button {
        background: none;
        border: none;
        color: white;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        font-size: 14px;
        font-weight: 500;
    }
    .bar-button:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
    .bar-button svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
    }
`;

export function initViewportMenu(uiPage, repoPage) {
    const styleElement = document.createElement('style');
    styleElement.textContent = menuStyles;
    document.head.appendChild(styleElement);

    const floatingBar = document.createElement('div');
    floatingBar.id = 'floating-bar';
    floatingBar.innerHTML = `
        <button class="bar-button" id="bar-btn-ui">
            <svg viewBox="0 0 24 24"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"></path></svg>
            UI
        </button>
        <button class="bar-button" id="bar-btn-repo">
            <svg viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z"></path></svg>
            Repo
        </button>
        <button class="bar-button" id="bar-btn-layout">
            <svg viewBox="0 0 24 24"><path d="M19 13H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm0 6H5v-4h14v4zM19 3H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 6H5V5h14v4z"></path></svg>
            Layout
        </button>
        <button class="bar-button" id="bar-btn-fullscreen">
            <svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>
            Fullscreen
        </button>
    `;
    document.body.appendChild(floatingBar);

    document.getElementById('bar-btn-ui').addEventListener('click', () => {
        uiPage.classList.remove('hidden');
        repoPage.classList.add('hidden');
    });

    document.getElementById('bar-btn-repo').addEventListener('click', () => {
        uiPage.classList.add('hidden');
        repoPage.classList.remove('hidden');
    });
    
    document.getElementById('bar-btn-layout').addEventListener('click', () => {
        const uiPanel = document.getElementById('ui-library-panel');
        if (uiPanel) uiPanel.classList.remove('hidden');
    });
}
