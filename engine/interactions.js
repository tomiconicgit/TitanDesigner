import { updateComponent } from './layoutSchema.js';
import { populateTools } from './inspector.js';

let activeElement = null;
let isDragging = false;
let startX, startY, startTime;
const tapThreshold = 5;
const longPressDuration = 250;

const canvas = document.getElementById('canvas');
const contextMenu = document.getElementById('context-menu');
const toolsPanel = document.getElementById('tools-panel');
const toolsOverlay = document.getElementById('tools-overlay');

// Function to hide the tools panel and remove the scroll lock
function hideToolsPanel() {
    toolsPanel.classList.remove('visible');
    toolsOverlay.classList.remove('visible');
    document.body.classList.remove('noscroll'); // Remove scroll lock
    setTimeout(() => {
        toolsPanel.classList.add('hidden');
    }, 300);
}

document.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target) && !e.target.classList.contains('canvas-element')) {
        contextMenu.classList.add('hidden');
    }
});

toolsOverlay.addEventListener('click', hideToolsPanel);

contextMenu.addEventListener('click', (e) => {
    const action = e.target.getAttribute('data-action');
    if (!action || !activeElement) return;

    if (action === 'tools') {
        populateTools(activeElement.id);

        const elementRect = activeElement.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const elementMidY = elementRect.top + (elementRect.height / 2);
        const canvasMidY = canvasRect.top + (canvasRect.height / 2);
        
        toolsPanel.className = 'hidden';

        if (elementMidY > canvasMidY) {
            toolsPanel.classList.add('slide-from-top');
        } else {
            toolsPanel.classList.add('slide-from-bottom');
        }
        
        document.body.classList.add('noscroll'); // Add scroll lock
        toolsPanel.classList.add('visible');
        toolsOverlay.classList.add('visible');
    }

    console.log(`Action: ${action} on element ${activeElement.id}`);
    contextMenu.classList.add('hidden');
});

function showContextMenu(element) {
    const elementRect = element.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    
    let menuX = elementRect.right;
    let menuY = elementRect.top;

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
        // Stop drag from starting if the click is on a scrollbar or UI control
        if (e.target !== element) return;

        activeElement = element;
        isDragging = false;
        
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        startTime = Date.now();
        
        const rect = element.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;

        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd, { once: true });
        
        document.addEventListener('touchmove', dragMove, { passive: false }); // Set passive: false
        document.addEventListener('touchend', dragEnd, { once: true });
    };

    const dragMove = (e) => {
        const touch = e.touches ? e.touches[0] : e;
        const deltaX = Math.abs(touch.clientX - startX);
        const deltaY = Math.abs(touch.clientY - startY);

        if (!isDragging && (deltaX > tapThreshold || deltaY > tapThreshold)) {
            isDragging = true;
            contextMenu.classList.add('hidden');
        }

        if (isDragging) {
            if (e.cancelable) e.preventDefault(); // Prevent scroll while dragging

            const canvasRect = canvas.getBoundingClientRect();
            let newX = touch.clientX - canvasRect.left - offsetX;
            let newY = touch.clientY - canvasRect.top - offsetY;

            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
        }
    };

    const dragEnd = (e) => {
        const elapsedTime = Date.now() - startTime;
        
        if (isDragging) {
            const newX = parseFloat(element.style.left);
            const newY = parseFloat(element.style.top);
            updateComponent(element.id, { x: newX, y: newY });
        } else if (elapsedTime < longPressDuration) {
            showContextMenu(element);
        }

        isDragging = false;
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('touchmove', dragMove);
    };

    element.addEventListener('mousedown', dragStart);
    element.addEventListener('touchstart', dragStart, { passive: true });
}
