document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const components = document.querySelectorAll('.component');

    // --- NEW: Slide-out Toolbar Logic ---
    const libraryPanel = document.getElementById('ui-library');
    const leftToolbarToggle = document.getElementById('left-toolbar-toggle');

    leftToolbarToggle.addEventListener('click', () => {
        libraryPanel.classList.toggle('visible');
    });

    // Close the panel when dragging a component from it
    libraryPanel.addEventListener('dragstart', () => {
        libraryPanel.classList.remove('visible');
    });


    // --- Drag and Drop Logic (Existing Code) ---
    let draggedItem = null;

    components.forEach(component => {
        component.addEventListener('dragstart', (e) => {
            draggedItem = e.target;
            setTimeout(() => {
                e.target.style.display = 'none';
            }, 0);
        });

        component.addEventListener('dragend', (e) => {
            setTimeout(() => {
                draggedItem.style.display = 'block';
                draggedItem = null;
            }, 0);
        });
    });

    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem) {
            const componentType = draggedItem.getAttribute('data-type');
            const newElement = document.createElement('div');
            newElement.textContent = componentType;
            newElement.style.position = 'absolute';
            newElement.style.padding = '10px';
            newElement.style.border = '1px dashed #ccc';
            newElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            newElement.style.cursor = 'move';

            const canvasRect = canvas.getBoundingClientRect();
            let x = e.clientX - canvasRect.left;
            let y = e.clientY - canvasRect.top;
            
            const style = window.getComputedStyle(canvas);
            const matrix = new DOMMatrixReadOnly(style.transform);
            const scale = matrix.a;
            
            newElement.style.left = `${x / scale - 50}px`;
            newElement.style.top = `${y / scale - 20}px`;

            canvas.appendChild(newElement);
        }
    });
});
