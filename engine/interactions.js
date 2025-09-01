// REMOVED: import { showCustomisationMenu } from '../viewport/customisationtoolbar.js';

let draggedComponent = null;
let isDragging = false;
let selectedComponentId = null;

export function initInteractions() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleInteractionStart);
    canvas.addEventListener('touchstart', handleInteractionStart, { passive: true });
}

function handleInteractionStart(event) {
    const target = event.target.closest('[data-component-id]');
    
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
    isDragging = true;

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
    const canvas = document.getElementById('canvas');
    if (draggedComponent && isDragging) {
        const id = draggedComponent.element.dataset.componentId;
        const x = parseInt(draggedComponent.element.style.left);
        const y = parseInt(draggedComponent.element.style.top);
        import('./projectschema.js').then(({ updateComponent }) => {
            updateComponent(id, { x, y });
        });
    } else if (draggedComponent && !isDragging) {
        // --- THIS IS THE MAJOR CHANGE ---
        // Instead of calling a function, we dispatch an event that another module can listen for.
        const clientX = event.type.includes('touch') ? event.changedTouches[0].clientX : event.clientX;
        const clientY = event.type.includes('touch') ? event.changedTouches[0].clientY : event.clientY;
        
        const tapEvent = new CustomEvent('componentTapped', {
            detail: { x: clientX, y: clientY }
        });
        canvas.dispatchEvent(tapEvent);
    }
    
    draggedComponent = null;
    document.removeEventListener('mousemove', handleInteractionMove);
    document.removeEventListener('touchmove', handleInteractionMove);
    document.removeEventListener('mouseup', handleInteractionEnd);
    document.removeEventListener('touchend', handleInteractionEnd);
}

function selectComponent(element) {
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
