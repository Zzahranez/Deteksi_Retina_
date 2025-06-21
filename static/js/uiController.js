class UIController {
    constructor() {
        this.fileInput = document.getElementById('fileInput');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.previewImage = document.getElementById('preview');
        this.uploadLabel = document.querySelector('.neuro-upload-label');
        this.resultsSection = document.querySelector('.neuro-results');


        this.initEventListeners();
        this.setupHoverEffects();
    }

    initEventListeners() {
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.analyzeBtn.addEventListener('click', () => this.analyzeImage());
    }
    setupHoverEffects() {
        const uploadArea = document.querySelector('.neuro-upload-area');

        uploadArea.addEventListener('mouseenter', () => {
            document.querySelectorAll('.neuron').forEach(n => {
                n.style.animationPlayState = 'paused';
            });
        });

        uploadArea.addEventListener('mouseleave', () => {
            document.querySelectorAll('.neuron').forEach(n => {
                n.style.animationPlayState = 'running';
            });
        });
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            this.showError('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewImage.src = e.target.result;
            this.uploadLabel.querySelector('span').textContent = file.name;
            this.analyzeBtn.disabled = false;
            this.resultsSection.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

   


    showLoading(show) {
        const loader = this.analyzeBtn.querySelector('.neuro-btn-loader');
        const btnText = this.analyzeBtn.querySelector('.neuro-btn-text');

        if (show) {
            btnText.textContent = "Analyzing...";
            loader.style.width = "100%";
            this.analyzeBtn.disabled = true;
        } else {
            btnText.textContent = "Analyze";
            loader.style.width = "0%";
            this.analyzeBtn.disabled = false;
        }
    }

    displayResults(data) {
        // Update diagnosis
        document.querySelector('.neuro-diagnosis-value').textContent = data.diagnosis;

        // Update confidence meter
        document.querySelector('.neuro-confidence-fill').style.width = `${data.confidence * 100}%`;

        // Update probability bars
        const container = document.querySelector('.neuro-probability-bar-container');
        container.innerHTML = '';

        data.probabilities.forEach(item => {
            const bar = document.createElement('div');
            bar.className = 'neuro-probability-bar';

            const label = document.createElement('span');
            label.className = 'neuro-probability-label';
            label.textContent = item.condition;

            const track = document.createElement('div');
            track.className = 'neuro-probability-track';

            const fill = document.createElement('div');
            fill.className = 'neuro-probability-fill';
            fill.style.width = `${item.probability * 100}%`;

            const value = document.createElement('span');
            value.className = 'neuro-probability-value';
            value.textContent = `${Math.round(item.probability * 100)}%`;

            track.appendChild(fill);
            bar.appendChild(label);
            bar.appendChild(track);
            bar.appendChild(value);
            container.appendChild(bar);
        });
    }

    showError(message) {
        // Implement error display
        console.error(message);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UIController();
});