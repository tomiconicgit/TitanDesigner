import { updateComponent } from './layoutSchema.js';
import { populateTools } from './inspector.js';

let activeElement = null;
const canvas = document.getElementById('canvas');
const contextMenu = document.getElementById('context-menu');
const toolsPanel = document.getElementById('tools-panel');
const toolsOverlay = document.getElementById('tools-overlay');

// Your original, robust scroll-locking functions
let scrollPosition = 0;
function lockScroll() {
    scrollPosition = window.pageYOffset;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
    document.body.classList.add('noscroll');
}

function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollPosition);
    document.body.classList.remove('noscroll');
}

// Function to hide the tools panel and remove the scroll lock
function hideToolsPanel() {
    toolsPanel.classList.remove('visible');
    toolsOverlay.classList.remove('visible');
    unlockScroll();
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
        
        lockScroll();
        toolsPanel.classList.add('visible');
        toolsOverlay.classList.add('visible');
    }

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

// REWRITTEN: The core interaction logic is now properly scoped
export function makeInteractive(element) {
    let isDragging = false;
    let startX, startY, startTime;
    let offsetX, offsetY;
    const tapThreshold = 5;
    const longPressDuration = 250;

    const dragStart = (e) => {
        activeElement = element;
        isDragging = false;
        
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        startTime = Date.now();
        
        const rect = element.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;

        // Add move/end listeners to the window to capture the drag globally
        // These will be REMOVED on drag end.
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
            contextMenu.classList.add('hidden');
        }

        if (isDragging) {
            // This preventDefault is now ONLY called during an actual drag
            // and won't interfere with anything else.
            if (e.cancelable) e.preventDefault();

            const canvasRect = canvas.getBoundingClientRect();
            let newX = touch.clientX - canvasRect.left - offsetX;
            let newY = touch.clientY - canvasRect.top - offsetY;

            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
        }
    };

    const dragEnd = () => {
        // CRITICAL: Remove the listeners from the window so they don't
        // interfere with other UI interactions like clicking or scrolling.
        window.removeEventListener('mousemove', dragMove);
        window.removeEventListener('touchmove', dragMove);
        
        const elapsedTime = Date.now() - startTime;
        
        if (isDragging) {
            const newX = parseFloat(element.style.left);
            const newY = parseFloat(element.style.top);
            updateComponent(element.id, { x: newX, y: newY });
        } else if (elapsedTime < longPressDuration) {
            showContextMenu(element);
        }

        isDragging = false;
    };

    element.addEventListener('mousedown', dragStart);
    element.addEventListener('touchstart', dragStart, { passive: true });
}
