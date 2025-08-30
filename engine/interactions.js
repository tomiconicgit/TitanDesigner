import { updateComponent } from './layoutSchema.js';

let activeElement = null;
const canvas = document.getElementById('canvas');

// REWRITTEN: The core interaction logic is now properly scoped and simplified.
export function makeInteractive(element) {
    let isDragging = false;
    let startX, startY;
    let offsetX, offsetY;
    const tapThreshold = 5;

    const dragStart = (e) => {
        activeElement = element;
        isDragging = false;
        
        const touch = e.touches? e.touches : e;
        startX = touch.clientX;
        startY = touch.clientY;
        
        const rect = element.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;

        // Add move/end listeners to the window to capture the drag globally
        window.addEventListener('mousemove', dragMove);
        window.addEventListener('mouseup', dragEnd, { once: true });
        window.addEventListener('touchmove', dragMove, { passive: false });
        window.addEventListener('touchend', dragEnd, { once: true });
    };

    const dragMove = (e) => {
        const touch = e.touches? e.touches : e;
        const deltaX = Math.abs(touch.clientX - startX);
        const deltaY = Math.abs(touch.clientY - startY);

        if (!isDragging && (deltaX > tapThreshold |

| deltaY > tapThreshold)) {
            isDragging = true;
        }

        if (isDragging) {
            if (e.cancelable) e.preventDefault();

            const canvasRect = canvas.getBoundingClientRect();
            let newX = touch.clientX - canvasRect.left - offsetX;
            let newY = touch.clientY - canvasRect.top - offsetY;

            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
        }
    };

    const dragEnd = () => {
        // Remove the global listeners
        window.removeEventListener('mousemove', dragMove);
        window.removeEventListener('touchmove', dragMove);
        
        if (isDragging) {
            const newX = parseFloat(element.style.left);
            const newY = parseFloat(element.style.top);
            updateComponent(element.id, { x: newX, y: newY });
        }
        // All context menu logic has been removed.
        isDragging = false;
    };

    element.addEventListener('mousedown', dragStart);
    element.addEventListener('touchstart', dragStart, { passive: true });
}
