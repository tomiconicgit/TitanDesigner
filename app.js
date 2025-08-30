document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const components = document.querySelectorAll('.component');

    let draggedItem = null;

    // Add drag start listener to all components in the library
    components.forEach(component => {
        component.addEventListener('dragstart', (e) => {
            draggedItem = e.target;
            // A slight delay to let the browser capture the drag image
            setTimeout(() => {
                e.target.style.display = 'none';
            }, 0);
        });

        component.addEventListener('dragend', (e) => {
            // After drag ends, make the original component visible again
            setTimeout(() => {
                draggedItem.style.display = 'block';
                draggedItem = null;
            }, 0);
        });
    });

    // --- Canvas Drag and Drop Events ---

    // When a draggable item enters the canvas area
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault(); // This is necessary to allow a drop
    });

    // When a draggable item is dropped on the canvas
    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem) {
            const componentType = draggedItem.getAttribute('data-type');
            
            // Create a new element to represent the dropped component
            const newElement = document.createElement('div');
            newElement.textContent = componentType;
            
            // Basic styling for the new element
            newElement.style.position = 'absolute';
            newElement.style.padding = '10px';
            newElement.style.border = '1px dashed #ccc';
            newElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            newElement.style.cursor = 'move';

            // Position the new element where the mouse was dropped
            const canvasRect = canvas.getBoundingClientRect();
            let x = e.clientX - canvasRect.left - 50; // Adjust for element width
            let y = e.clientY - canvasRect.top - 20;  // Adjust for element height
            
            newElement.style.left = `${x}px`;
            newElement.style.top = `${y}px`;

            canvas.appendChild(newElement);
        }
    });
});
