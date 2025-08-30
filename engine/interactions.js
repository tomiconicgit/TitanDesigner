import { updateComponent } from './layoutSchema.js';

let activeElement = null; // The element being interacted with
let isDragging = false;
let startX, startY, startTime;
const tapThreshold = 5; // Max pixels to move to be considered a tap
const longPressDuration = 250; // ms

// --- Context Menu ---
const contextMenu = document.getElementById('context-menu');
document.addEventListener('click', (e) => {
    // Hide menu if clicking anywhere else
    if (!contextMenu.contains(e.target) && !e.target.classList.contains('canvas-element')) {
        contextMenu.classList.add('hidden');
        activeElement = null;
    }
});

// We'll add logic for the menu buttons later
contextMenu.addEventListener('click', (e) => {
    const action = e.target.getAttribute('data-action');
    if (!action || !activeElement) return;

    console.log(`Action: ${action} on element ${activeElement.id}`);
    // Future logic for delete, duplicate, tools will go here.

    contextMenu.classList.add('hidden'); // Hide after action
});


function showContextMenu(element, event) {
    const canvasRect = document.getElementById('canvas').getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    // Position menu to the right of the element
    let menuX = elementRect.right;
    let menuY = elementRect.top;

    // Reposition if it overflows the canvas view
    if (menuX + contextMenu.offsetWidth > canvasRect.right) {
        menuX = elementRect.left - contextMenu.offsetWidth;
    }
    if (menuY + contextMenu.offsetHeight > canvasRect.bottom) {
        menuY = elementRect.bottom - contextMenu.offsetHeight;
    }

    contextMenu.style.left = `${menuX}px`;
    contextMenu.style.top = `${menuY}px`;
    contextMenu.classList.remove('hidden');
}


export function makeInteractive(element) {
    let offsetX, offsetY;

    const dragStart = (e) => {
        activeElement = element;
        isDragging = false; // Reset dragging state
        
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        startTime = Date.now();
        
        const rect = element.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;

        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd, { once: true });
        
        document.addEventListener('touchmove', dragMove);
        document.addEventListener('touchend', dragEnd, { once: true });
    };

    const dragMove = (e) => {
        const touch = e.touches ? e.touches[0] : e;
        const deltaX = Math.abs(touch.clientX - startX);
        const deltaY = Math.abs(touch.clientY - startY);

        // If moved beyond the tap threshold, it's a drag
        if (deltaX > tapThreshold || deltaY > tapThreshold) {
            isDragging = true;
            contextMenu.classList.add('hidden'); // Hide menu if it was open
        }

        if (isDragging) {
            const canvasRect = document.getElementById('canvas').getBoundingClientRect();
            let newX = touch.clientX - canvasRect.left - offsetX;
            let newY = touch.clientY - canvasRect.top - offsetY;

            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
        }
    };

    const dragEnd = (e) => {
        const elapsedTime = Date.now() - startTime;
        
        if (isDragging) {
            // If it was a drag, finalize the position
            const newX = parseFloat(element.style.left);
            const newY = parseFloat(element.style.top);
            updateComponent(element.id, { x: newX, y: newY });
        } else if (elapsedTime < longPressDuration) {
            // If it wasn't a drag and it was short, it's a tap
            showContextMenu(element, e);
        }

        // Cleanup
        isDragging = false;
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('touchmove', dragMove);
    };

    element.addEventListener('mousedown', dragStart);
    element.addEventListener('touchstart', dragStart, { passive: true });
}
