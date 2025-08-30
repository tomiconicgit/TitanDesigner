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

/* --- SAFE ZONE: make scrollable panels ignore propagation so touches there won't start canvas drag --- */
function initScrollableSafeZones() {
    const selectors = ['#ui-library', '.tools-content'];
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            // stop propagation so touchstart inside these elements won't bubble to other listeners
            el.addEventListener('touchstart', (e) => {
                // We keep this passive to allow native scrolling, but we stop propagation
                e.stopPropagation();
            }, { passive: true });

            // Also stop pointer events for pointer-based browsers
            el.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
            }, { passive: true });
        });
    });
}
initScrollableSafeZones();

document.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target) && !e.target.classList.contains('canvas-element')) {
        contextMenu.classList.add('hidden');
    }
});

toolsOverlay.addEventListener('click', () => {
    toolsPanel.classList.remove('visible');
    toolsOverlay.classList.remove('visible');
    setTimeout(() => {
        toolsPanel.classList.add('hidden');
    }, 300);
});

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
        activeElement = element;
        isDragging = false;
        
        // If the initial target is inside a scrollable panel, do nothing (safe-guard)
        // This is defensive — the safe-zone listeners should have already stopped propagation,
        // but keep the check to be robust.
        const origin = (e.touches ? e.touches[0] : e).target || e.target;
        if (origin && origin.closest && (origin.closest('#ui-library') || origin.closest('.tools-content'))) {
            return;
        }

        // For touch, we want to prevent the native page scroll ONLY when dragging.
        // So register non-passive listeners and call preventDefault during dragMove.
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        startTime = Date.now();
        
        const rect = element.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;

        // Add listeners with explicit options so we can preventDefault when dragging
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd, { once: true });
        
        document.addEventListener('touchmove', dragMove, { passive: false });
        document.addEventListener('touchend', dragEnd, { once: true });
    };

    const dragMove = (e) => {
        const touch = e.touches ? e.touches[0] : e;
        const deltaX = Math.abs(touch.clientX - startX);
        const deltaY = Math.abs(touch.clientY - startY);

        if (deltaX > tapThreshold || deltaY > tapThreshold) {
            isDragging = true;
            contextMenu.classList.add('hidden');
        }

        if (isDragging) {
            // stop native scroll while actively dragging an element
            if (e.cancelable) e.preventDefault();

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
        document.removeEventListener('touchmove', dragMove, { passive: false });
    };

    // mouse: regular
    element.addEventListener('mousedown', dragStart);
    // touch: non-passive so we can preventDefault during drag
    element.addEventListener('touchstart', dragStart, { passive: false });
}