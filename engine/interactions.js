import { showCustomisationMenu } from '../viewport/customisationtoolbar.js';

let draggedComponent = null;
let isDragging = false;
let selectedComponentId = null;

export function initInteractions() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    // Use mousedown/touchstart to handle both tap and drag start
    canvas.addEventListener('mousedown', handleInteractionStart);
    canvas.addEventListener('touchstart', handleInteractionStart, { passive: true });
}

function handleInteractionStart(event) {
    const target = event.target.closest('[data-component-id]');
    
    // Deselect if clicking on the canvas background
    if (!target) {
        selectComponent(null);
        return;
    }

    isDragging = false;
    selectComponent(target);

    const canvasRect = canvas.getBoundingClientRect();
    const clientX = event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
    const clientY = event.type.includes('touch') ? event.touches[0].clientY : event.clientY;
    const offsetX = clientX - canvasRect.left - parseInt(target.style.left || 0);
    const offsetY = clientY - canvasRect.top - parseInt(target.style.top || 0);

    draggedComponent = { element: target, offsetX, offsetY };

    document.addEventListener('mousemove', handleInteractionMove);
    document.addEventListener('touchmove', handleInteractionMove, { passive: false });
    document.addEventListener('mouseup', handleInteractionEnd);
    document.addEventListener('touchend', handleInteractionEnd);
}

function handleInteractionMove(event) {
    if (!draggedComponent) return;
    isDragging = true; // If we move, it's a drag

    event.preventDefault();
    const canvasRect = canvas.getBoundingClientRect();
    const clientX = event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
    const clientY = event.type.includes('touch') ? event.touches[0].clientY : event.clientY;

    const x = clientX - canvasRect.left - draggedComponent.offsetX;
    const y = clientY - canvasRect.top - draggedComponent.offsetY;
    draggedComponent.element.style.left = `${x}px`;
    draggedComponent.element.style.top = `${y}px`;
}

function handleInteractionEnd(event) {
    if (draggedComponent && isDragging) {
        // Update schema with final position after dragging
        const id = draggedComponent.element.dataset.componentId;
        const x = parseInt(draggedComponent.element.style.left);
        const y = parseInt(draggedComponent.element.style.top);
        import('./layoutschema.js').then(({ updateComponent }) => {
            updateComponent(id, { x, y });
        });
    } else if (draggedComponent && !isDragging) {
        // If we didn't drag, it's a tap. Show the menu.
        const clientX = event.type.includes('touch') ? event.changedTouches[0].clientX : event.clientX;
        const clientY = event.type.includes('touch') ? event.changedTouches[0].clientY : event.clientY;
        showCustomisationMenu(draggedComponent.element, clientX, clientY);
    }
    
    draggedComponent = null;
    document.removeEventListener('mousemove', handleInteractionMove);
    document.removeEventListener('touchmove', handleInteractionMove);
    document.removeEventListener('mouseup', handleInteractionEnd);
    document.removeEventListener('touchend', handleInteractionEnd);
}

// NEW: Central function to manage selection
function selectComponent(element) {
    // Remove selection from previous element
    if (selectedComponentId) {
        const oldSelected = document.querySelector(`[data-component-id="${selectedComponentId}"]`);
        if (oldSelected) oldSelected.classList.remove('selected');
    }

    if (element) {
        element.classList.add('selected');
        selectedComponentId = element.dataset.componentId;
    } else {
        selectedComponentId = null;
    }
}

export function getSelectedComponentId() {
    return selectedComponentId;
}
