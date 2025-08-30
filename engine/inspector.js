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

    // Create sliders for Width, Height, and Corner Radius
    content.appendChild(createSlider('width', 'Width', { min: 20, max: 370, step: 2 }));
    content.appendChild(createSlider('height', 'Height', { min: 20, max: 800, step: 2 }));
    content.appendChild(createSlider('borderRadius', 'Corner Radius', { min: 0, max: 100, step: 1 }));
}

// A helper function to create our custom slider controls
function createSlider(property, label, opts) {
    const currentValue = activeComponent.props[property] || 0;

    // Create the main container
    const control = document.createElement('div');
    control.className = 'tool-control slider-control';

    // Create the label
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    control.appendChild(labelEl);

    // Create the wrapper for the buttons and slider
    const wrapper = document.createElement('div');
    wrapper.className = 'slider-wrapper';
    control.appendChild(wrapper);

    // Minus Button
    const minusBtn = document.createElement('button');
    minusBtn.className = 'slider-btn minus';
    minusBtn.textContent = '−';
    wrapper.appendChild(minusBtn);

    // Slider Track and Progress Bar
    const track = document.createElement('div');
    track.className = 'slider-track';
    const progress = document.createElement('div');
    progress.className = 'slider-progress';
    track.appendChild(progress);
    wrapper.appendChild(track);

    // Plus Button
    const plusBtn = document.createElement('button');
    plusBtn.className = 'slider-btn plus';
    plusBtn.textContent = '+';
    wrapper.appendChild(plusBtn);

    // Value Display
    const valueEl = document.createElement('span');
    valueEl.className = 'slider-value';
    wrapper.appendChild(valueEl);
    
    // --- Logic for updating the slider ---
    const updateSlider = (newValue) => {
        // Clamp the value within the min/max range
        const value = Math.max(opts.min, Math.min(opts.max, newValue));

        // Update the component's property in the layout schema
        updateComponent(activeComponent.id, { [property]: value });

        // Update the text and progress bar
        valueEl.textContent = `${value}px`;
        const percent = ((value - opts.min) / (opts.max - opts.min)) * 100;
        progress.style.width = `${percent}%`;

        // Re-render the canvas to show the change
        render();
    };

    // Set initial state
    updateSlider(currentValue);

    // Add event listeners
    minusBtn.addEventListener('click', () => updateSlider(activeComponent.props[property] - opts.step));
    plusBtn.addEventListener('click', () => updateSlider(activeComponent.props[property] + opts.step));

    return control;
}
