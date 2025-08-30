import { updateComponent } from './layoutSchema.js';
import { render } from './renderer.js';

let selectedElement = null;

export function makeDraggable(element) {
    let offsetX, offsetY;

    // --- Event Handlers ---
    const dragStart = (e) => {
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
        
        // Get initial coordinates from either mouse or touch event
        const startX = e.clientX || e.touches[0].clientX;
        const startY = e.clientY || e.touches[0].clientY;
        
        offsetX = startX - rect.left;
        offsetY = startY - rect.top;

        // Add move and end listeners to the document
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd, { once: true });
        
        document.addEventListener('touchmove', dragMove);
        document.addEventListener('touchend', dragEnd, { once: true });
    };

    const dragMove = (e) => {
        if (!selectedElement) return;

        const canvasRect = document.getElementById('canvas').getBoundingClientRect();
        
        // Get move coordinates from either mouse or touch event
        const moveX = e.clientX || e.touches[0].clientX;
        const moveY = e.clientY || e.touches[0].clientY;

        // Convert mouse position to be relative to the canvas
        let newX = moveX - canvasRect.left - offsetX;
        let newY = moveY - canvasRect.top - offsetY;

        // Update the element's style for immediate visual feedback
        selectedElement.style.left = `${newX}px`;
        selectedElement.style.top = `${newY}px`;
    };

    const dragEnd = () => {
        if (!selectedElement) return;
        
        // Remove all document listeners
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('touchmove', dragMove);
        
        // Finalize the position by updating the schema
        const newX = parseFloat(selectedElement.style.left);
        const newY = parseFloat(selectedElement.style.top);
        
        updateComponent(selectedElement.id, { x: newX, y: newY });
    };

    // --- Attach Initial Listeners ---
    element.addEventListener('mousedown', dragStart);
    element.addEventListener('touchstart', dragStart);
}
