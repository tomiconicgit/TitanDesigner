import { getFileContent, updateFileContent, getActiveView, findNodeInTree } from '../engine/projectschema.js';

const editorStyles = `
    #code-editor-panel {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100dvh;
        background: rgba(28, 28, 30, 0.95);
        z-index: 6000;
        display: flex;
        flex-direction: column;
        color: white;
        font-family: 'SF Mono', monospace;
    }

    .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        border-bottom: 1px solid rgba(80, 80, 80, 0.6);
    }

    .editor-header h3 {
        margin: 0;
        font-weight: 500;
    }

    .editor-content {
        flex-grow: 1;
        padding: 20px;
        overflow-y: auto;
    }

    .editor-textarea {
        width: 100%;
        height: 100%;
        background: #1e1e1e;
        border: none;
        color: white;
        font-size: 14px;
        padding: 10px;
        resize: none;
        font-family: 'SF Mono', monospace;
    }

    .close-btn {
        background: #444;
        border: none;
        color: #eee;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
    }

    .hidden {
        display: none;
    }
`;

export function initCodeEditor() {
    const styleElement = document.createElement('style');
    styleElement.textContent = editorStyles;
    document.head.appendChild(styleElement);

    const editorPanel = document.createElement('div');
    editorPanel.id = 'code-editor-panel';
    editorPanel.className = 'hidden';
    editorPanel.innerHTML = `
        <div class="editor-header">
            <h3 id="editor-title">Code Editor</h3>
            <button class="close-btn">×</button>
        </div>
        <div class="editor-content">
            <textarea class="editor-textarea"></textarea>
        </div>
    `;
    document.body.appendChild(editorPanel);

    const textarea = editorPanel.querySelector('.editor-textarea');
    const closeBtn = editorPanel.querySelector('.close-btn');

    closeBtn.addEventListener('click', () => {
        editorPanel.classList.add('hidden');
    });

    textarea.addEventListener('input', () => {
        const activeView = getActiveView();
        if (activeView) {
            updateFileContent(activeView.id, textarea.value);
        }
    });
}

export function showCodeEditor(fileId) {
    const editorPanel = document.getElementById('code-editor-panel');
    const textarea = editorPanel.querySelector('.editor-textarea');
    const title = editorPanel.querySelector('#editor-title');
    const file = findNodeInTree(fileId);

    if (file && file.type === 'file') {
        title.textContent = `Editing ${file.name}`;
        textarea.value = typeof file.content === 'string' ? file.content : JSON.stringify(file.content, null, 2);
        editorPanel.classList.remove('hidden');
    }
}