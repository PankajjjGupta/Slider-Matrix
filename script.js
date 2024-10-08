const maxRows = 26;
const table = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
const matrixContainer = document.getElementById('matrixContainer');
const addRowBtn = document.getElementById('addRowBtn');
const tooltip = document.getElementById('tooltip');

function updatePoints() {
    // Clear existing points
    matrixContainer.querySelectorAll('.point').forEach(point => point.remove());

    // Loop through all rows and plot the points
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, index) => {
        const idea = row.querySelector('.ideaInput').value.trim();
        const ease = parseFloat(row.querySelector('.easeSlider').value);
        const value = parseFloat(row.querySelector('.valueSlider').value);

        if (idea) {
            const xPos = (ease / 10) * 100;
            const yPos = 100 - (value / 10) * 100;

            const point = document.createElement('div');
            point.className = 'point';
            point.style.left = `${xPos}%`;
            point.style.top = `${yPos}%`;

            // Add a label next to the dot
            const label = document.createElement('div');
            label.className = 'point-label';
            label.textContent = String.fromCharCode(65 + index); // A, B, C, etc.
            point.appendChild(label);

            // Show tooltip on hover
            point.addEventListener('mouseenter', (e) => {
                tooltip.textContent = idea;
                tooltip.style.left = `${e.pageX + 10}px`;
                tooltip.style.top = `${e.pageY + 10}px`;
                tooltip.style.opacity = 1;
            });

            // Hide tooltip on mouse leave
            point.addEventListener('mouseleave', () => {
                tooltip.style.opacity = 0;
            });

            // Update tooltip position on mouse move
            point.addEventListener('mousemove', (e) => {
                tooltip.style.left = `${e.pageX + 10}px`;
                tooltip.style.top = `${e.pageY + 10}px`;
            });

            matrixContainer.appendChild(point);
        }
    });
}

function validateIdeaInput(row) {
    const ideaInput = row.querySelector('.ideaInput').value.trim();
    if (!ideaInput) {
        alert("Please enter an idea name before adjusting the sliders.");
        return false;
    }
    return true;
}

function applySliderBackground(slider) {
    const value = slider.value;
    const min = slider.min ? slider.min : 0;
    const max = slider.max ? slider.max : 100;
    const percentage = ((value - min) / (max - min)) * 100;

    // Determine the color based on the class
    let sliderColor;
    if (slider.classList.contains('easeSlider')) {
        sliderColor = '#EF8C34';  // Original color for easeSlider
    } else if (slider.classList.contains('valueSlider')) {
        sliderColor = '#F2BF50';  // Original color for valueSlider
    }

    // Apply the gradient with the correct color
    slider.style.background = `linear-gradient(to right, ${sliderColor} 0%, ${sliderColor} ${percentage}%, #E8EDF3 ${percentage}%, #E8EDF3 100%)`;
}


function addRow() {
    const rowCount = table.rows.length;
    if (rowCount < maxRows) {
        const newRow = table.insertRow();

        // Insert the idea input cell with the alphabet label
        const ideaCell = newRow.insertCell();
        ideaCell.style.position = "relative";

        let label = '';
        if (rowCount < 26) {
            // For rows 0-25, use letters A-Z
            label = String.fromCharCode(65 + rowCount);
        } else {
            // For rows beyond 25, use a custom label or stop labeling
            label = ''; // Empty label, or implement custom logic here
        }

        ideaCell.innerHTML = `
            <div class="label-formation">
                ${label}
            </div>
            <input type="text" class="ideaInput">
        `;

        // Insert the ease slider cell
        const easeSliderCell = newRow.insertCell();
        easeSliderCell.innerHTML = '<input type="range" class="easeSlider" min="0" max="10" value="0" step="0.01">';

        // Insert the value slider cell
        const valueSliderCell = newRow.insertCell();
        valueSliderCell.innerHTML = '<input type="range" class="valueSlider" min="0" max="10" value="0" step="0.01">';

        // Apply the initial background to sliders
        const easeSlider = newRow.querySelector('.easeSlider');
        const valueSlider = newRow.querySelector('.valueSlider');
        applySliderBackground(easeSlider);
        applySliderBackground(valueSlider);

        // Attach event listeners to the new idea input field
        const ideaInput = newRow.querySelector('.ideaInput');
        ideaInput.addEventListener('input', function() {
            updatePoints();  // Update the points to reflect the new idea
        });

        // Attach event listeners to the new sliders with validation and background update
        easeSlider.addEventListener('input', function() {
            if (validateIdeaInput(newRow)) {
                applySliderBackground(easeSlider);
                updatePoints();
            } else {
                this.value = 0; // Reset the slider value to 0 if validation fails
                applySliderBackground(easeSlider);
            }
        });
        
        valueSlider.addEventListener('input', function() {
            if (validateIdeaInput(newRow)) {
                applySliderBackground(valueSlider);
                updatePoints();
            } else {
                this.value = 0; // Reset the slider value to 0 if validation fails
                applySliderBackground(valueSlider);
            }
        });
    }

    if (rowCount + 1 >= maxRows) {
        addRowBtn.disabled = true;
    }
}




table.querySelectorAll('.easeSlider, .valueSlider').forEach(slider => {
    slider.addEventListener('input', function() {
        const row = this.closest('tr');
        console.log("Row ",row)
        const value = this.value;
        const min = this.min ? this.min : 0;
        const max = this.max ? this.max : 100;
        const percentage = ((value - min) / (max - min)) * 100;

        // Determine the color based on the class
        let sliderColor;
        console.log(this)
        if (this.classList.contains('easeSlider')) {
            sliderColor = '#EF8C34';  // Original color for easeSlider
        } else if (this.classList.contains('valueSlider')) {
            sliderColor = '#F2BF50';  // Original color for valueSlider
        }

        // Apply the gradient with the correct color
        this.style.background = `linear-gradient(to right, ${sliderColor} 0%, ${sliderColor} ${percentage}%, #E8EDF3 ${percentage}%, #E8EDF3 100%)`;

        if (validateIdeaInput(row)) {
            updatePoints();
        } else {
            this.value = 0; // Reset the slider value to 0 if validation fails
            this.style.background = `linear-gradient(to right, ${sliderColor} 0%, ${sliderColor} 0%, #E8EDF3 0%, #E8EDF3 100%)`; // Reset background
        }
    });
});

// Add input event listeners to existing idea inputs to update tooltip on change
table.querySelectorAll('.ideaInput').forEach(input => {
    input.addEventListener('input', updatePoints);
});

addRowBtn.addEventListener('click', addRow);
updatePoints();
