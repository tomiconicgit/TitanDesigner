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
    content.appendChild(createSlider('width', 'Width', { min: 20, max: 370, step: 2, unit: 'px' }));
    content.appendChild(createSlider('height', 'Height', { min: 20, max: 800, step: 2, unit: 'px' }));
    content.appendChild(createSlider('borderRadius', 'Corner Radius', { min: 0, max: 100, step: 1, unit: 'px' }));
    
    // Create the color picker and opacity slider
    content.appendChild(createColorControl('backgroundColor', 'Background'));
    content.appendChild(createSlider('opacity', 'Opacity', { min: 0, max: 1, step: 0.05, unit: '%' }));
}

// Function to create the color control
function createColorControl(property, label) {
    const currentValue = activeComponent.props[property] || '#000000';

    const control = document.createElement('div');
    control.className = 'tool-control color-control';

    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    control.appendChild(labelEl);

    const wrapper = document.createElement('div');
    wrapper.className = 'color-control-wrapper';
    control.appendChild(wrapper);

    // Color picker input
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = currentValue;
    wrapper.appendChild(colorInput);

    // Text display for hex code
    const valueEl = document.createElement('span');
    valueEl.className = 'slider-value';
    valueEl.textContent = currentValue;
    wrapper.appendChild(valueEl);
    
    // Event listener to update schema and UI
    colorInput.addEventListener('input', (e) => {
        const newColor = e.target.value;
        updateComponent(activeComponent.id, { [property]: newColor });
        valueEl.textContent = newColor;
        render();
    });

    return control;
}

// A helper function to create our custom slider controls
function createSlider(property, label, opts) {
    const currentValue = activeComponent.props[property];

    const control = document.createElement('div');
    control.className = 'tool-control slider-control';

    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    control.appendChild(labelEl);

    const wrapper = document.createElement('div');
    wrapper.className = 'slider-wrapper';
    control.appendChild(wrapper);

    const minusBtn = document.createElement('button');
    minusBtn.className = 'slider-btn minus';
    minusBtn.textContent = '−';
    wrapper.appendChild(minusBtn);

    const track = document.createElement('div');
    track.className = 'slider-track';
    const progress = document.createElement('div');
    progress.className = 'slider-progress';
    track.appendChild(progress);
    wrapper.appendChild(track);

    const plusBtn = document.createElement('button');
    plusBtn.className = 'slider-btn plus';
    plusBtn.textContent = '+';
    wrapper.appendChild(plusBtn);

    const valueEl = document.createElement('span');
    valueEl.className = 'slider-value';
    wrapper.appendChild(valueEl);
    
    const updateSlider = (newValue) => {
        const value = Math.max(opts.min, Math.min(opts.max, newValue));
        updateComponent(activeComponent.id, { [property]: value });
        
        if (opts.unit === '%') {
            valueEl.textContent = `${Math.round(value * 100)}%`;
        } else {
            valueEl.textContent = `${Math.round(value)}${opts.unit}`;
        }

        const percent = ((value - opts.min) / (opts.max - opts.min)) * 100;
        progress.style.width = `${percent}%`;
        render();
    };

    updateSlider(currentValue);

    minusBtn.addEventListener('click', () => updateSlider(activeComponent.props[property] - opts.step));
    plusBtn.addEventListener('click', () => updateSlider(activeComponent.props[property] + opts.step));

    return control;
}
