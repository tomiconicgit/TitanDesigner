import { layoutSchema, updateComponent } from './layoutSchema.js';
import { render } from './renderer.js';

let activeComponent = null;

const toolsPanel = document.getElementById('tools-panel');

// This function is called when the "Tools" button is clicked.
export function populateTools(componentId) {
    activeComponent = layoutSchema.find(c => c.id === componentId);
    if (!activeComponent) return;

    // Clear any previous content and build the new tools
    const content = toolsPanel.querySelector('.tools-content');
    content.innerHTML = ''; 

    // --- Sizing and Style ---
    content.appendChild(createSlider('width', 'Width', { min: 20, max: 370, step: 2, unit: 'px' }));
    content.appendChild(createSlider('height', 'Height', { min: 20, max: 800, step: 2, unit: 'px' }));
    content.appendChild(createSlider('borderRadius', 'Corner Radius', { min: 0, max: 100, step: 1, unit: 'px' }));
    
    // --- Color and Opacity ---
    content.appendChild(createColorControl('backgroundColor', 'Background'));
    content.appendChild(createSlider('opacity', 'Opacity', { min: 0, max: 1, step: 0.05, unit: '%' }));

    // --- ADDED: Shadow Controls ---
    const divider = document.createElement('div');
    divider.className = 'tool-divider';
    content.appendChild(divider);

    content.appendChild(createToggleSwitch('shadowEnabled', 'Drop Shadow'));
    if (activeComponent.props.shadowEnabled) {
        content.appendChild(createSlider('shadowOffsetX', 'X Offset', { min: -20, max: 20, step: 1, unit: 'px' }));
        content.appendChild(createSlider('shadowOffsetY', 'Y Offset', { min: -20, max: 20, step: 1, unit: 'px' }));
        content.appendChild(createSlider('shadowBlur', 'Blur', { min: 0, max: 40, step: 1, unit: 'px' }));
    }

    // Temporary: Add dummy controls to force scrolling (remove after testing)
    for (let i = 0; i < 5; i++) {
        content.appendChild(createSlider(`dummy${ length} else {
            document.body.classList.remove('noscroll');
        }
    };

    leftToolbarToggle.addEventListener('click', toggleLibraryPanel);
    leftToolbarToggle.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent default touch behaviors
        console.log('Touchstart on toggle'); // Debug log
        toggleLibraryPanel();
    }, { passive: false });

    // --- Tap-to-Add Component Logic ---
    components.forEach(component => {
        component.addEventListener('click', () => {
            const componentType = component.getAttribute('data-type');
            
            const newComponent = {
                id: generateId(),
                type: componentType,
                props: {
                    text: `New ${componentType}`,
                    x: 150, 
                    y: 200,
                }
            };

            addComponent(newComponent);
            render();
            // Close the panel and remove the noscroll class after adding a component
            libraryPanel.classList.remove('visible');
            document.body.classList.remove('noscroll');
        });
    });
});