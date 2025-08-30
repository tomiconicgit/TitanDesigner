import { updateComponent } from './layoutSchema.js';
import { render } from './renderer.js';

let selectedElement = null;

export function makeDraggable(element) {
    let offsetX, offsetY;

    const onMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Deselect any previously selected element
        if (selectedElement) {
            selectedElement.classList.remove('selected');
        }
        
        // Select the new element
        selectedElement = element;
        selectedElement.classList.add('selected');

        const rect = element.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp, { once: true });
    };

    const onMouseMove = (e) => {
        if (!selectedElement) return;

        const canvasRect = document.getElementById('canvas').getBoundingClientRect();
        
        // Convert mouse position to be relative to the canvas
        let newX = e.clientX - canvasRect.left - offsetX;
        let newY = e.clientY - canvasRect.top - offsetY;

        // Update the element's style for immediate visual feedback
        selectedElement.style.left = `${newX}px`;
        selectedElement.style.top = `${newY}px`;
    };

    const onMouseUp = (e) => {
        if (!selectedElement) return;
        
        document.removeEventListener('mousemove', onMouseMove);
        
        // Finalize the position by updating the schema
        const newX = parseFloat(selectedElement.style.left);
        const newY = parseFloat(selectedElement.style.top);
        
        updateComponent(selectedElement.id, { x: newX, y: newY });
        
        // It's good practice to re-render from the schema after an update,
        // though in this case it's not strictly necessary.
        // render(); 
    };

    element.addEventListener('mousedown', onMouseDown);
}
