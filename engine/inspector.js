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
        // We could add a color picker for shadowColor here later
    }
}

// NEW: Function to create a toggle switch
function createToggleSwitch(property, label) {
    const currentValue = activeComponent.props[property];

    const control = document.createElement('div');
    control.className = 'tool-control toggle-control';

    const wrapper = document.createElement('div');
    wrapper.className = 'toggle-wrapper';
    control.appendChild(wrapper);

    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    wrapper.appendChild(labelEl);

    const switchLabel = document.createElement('label');
    switchLabel.className = 'switch';
    wrapper.appendChild(switchLabel);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = currentValue;
    switchLabel.appendChild(checkbox);

    const sliderSpan = document.createElement('span');
    sliderSpan.className = 'slider';
    switchLabel.appendChild(sliderSpan);
    
    checkbox.addEventListener('change', (e) => {
        const newValue = e.target.checked;
        updateComponent(activeComponent.id, { [property]: newValue });
        render();
        // Repopulate the tools panel to show/hide the sliders
        populateTools(activeComponent.id);
    });

    return control;
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

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = currentValue;
    wrapper.appendChild(colorInput);

    const valueEl = document.createElement('span');
    valueEl.className = 'slider-value';
    valueEl.textContent = currentValue;
    wrapper.appendChild(valueEl);
    
    colorInput.addEventListener('input', (e) => {
        const newValue = e.target.value;
        updateComponent(activeComponent.id, { [property]: newValue });
        valueEl.textContent = newValue;
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