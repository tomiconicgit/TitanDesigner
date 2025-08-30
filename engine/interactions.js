import { updateComponent } from './layoutSchema.js';

const canvas = document.getElementById('canvas');

export function makeInteractive(element) {
    let isDragging = false;
    let startX, startY;
    let offsetX, offsetY;
    const tapThreshold = 5;

    const dragStart = (e) => {
        isDragging = false;
        
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        
        const rect = element.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;

        window.addEventListener('mousemove', dragMove);
        window.addEventListener('mouseup', dragEnd, { once: true });
        window.addEventListener('touchmove', dragMove, { passive: false });
        window.addEventListener('touchend', dragEnd, { once: true });
    };

    const dragMove = (e) => {
        const touch = e.touches ? e.touches[0] : e;
        const deltaX = Math.abs(touch.clientX - startX);
        const deltaY = Math.abs(touch.clientY - startY);

        if (!isDragging && (deltaX > tapThreshold || deltaY > tapThreshold)) {
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
        window.removeEventListener('mousemove', dragMove);
        window.removeEventListener('touchmove', dragMove);
        
        if (isDragging) {
            const newX = parseFloat(element.style.left);
            const newY = parseFloat(element.style.top);
            updateComponent(element.id, { x: newX, y: newY });
        }

        isDragging = false;
    };

    element.addEventListener('mousedown', dragStart);
    element.addEventListener('touchstart', dragStart, { passive: true });
}