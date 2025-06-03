class NeuralAnimation {
    constructor() {
        this.container = document.querySelector('.neural-network-bg');
        this.neurons = [];
        this.connections = [];
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.activeConnections = new Set();
        this.init();
    }

    init() {
        this.createNeurons(25);
        this.createConnections(20);
        this.animate();
        this.setupMouseTracking();
    }

    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.updateNeuralFlow();
        });
    }

    updateNeuralFlow() {
        const ATTRACTION_DISTANCE = 200;
        const MAX_ROTATION = 25; // Derajat maksimal rotasi

        this.connections.forEach(conn => {
            const rect = conn.getBoundingClientRect();
            const startX = rect.left;
            const startY = rect.top;
            const endX = startX + rect.width;
            const endY = startY + rect.height;

            // Hitung titik tengah koneksi
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;

            const distance = Math.sqrt(
                Math.pow(midX - this.mouseX, 2) +
                Math.pow(midY - this.mouseY, 2)
            );

            if (distance < ATTRACTION_DISTANCE) {
                // Hitung sudut antara koneksi dan mouse
                const angleToMouse = Math.atan2(
                    this.mouseY - midY,
                    this.mouseX - midX
                ) * 180 / Math.PI;

                // Hitung sudut asli koneksi
                const originalAngle = Math.atan2(
                    endY - startY,
                    endX - startX
                ) * 180 / Math.PI;

                // Hitung rotasi yang diinginkan
                const rotationFactor = (1 - distance / ATTRACTION_DISTANCE);
                const rotation = originalAngle + (angleToMouse - originalAngle) * rotationFactor * 0.5;

                // Terapkan transformasi
                conn.style.transform = `rotate(${rotation}deg)`;
                conn.style.opacity = 0.7 + 0.3 * rotationFactor;

                // Tambahkan efek tarikan pada neuron di ujung koneksi
                const neuron1 = this.findNearestNeuron(startX, startY);
                const neuron2 = this.findNearestNeuron(endX, endY);

                if (neuron1) this.pullNeuronTowardMouse(neuron1, rotationFactor);
                if (neuron2) this.pullNeuronTowardMouse(neuron2, rotationFactor);

                this.activeConnections.add(conn);
            } else if (this.activeConnections.has(conn)) {
                // Kembalikan ke posisi semula jika mouse menjauh
                const originalAngle = Math.atan2(
                    parseFloat(conn.dataset.endY) - parseFloat(conn.dataset.startY),
                    parseFloat(conn.dataset.endX) - parseFloat(conn.dataset.startX)
                ) * 180 / Math.PI;

                conn.style.transform = `rotate(${originalAngle}deg)`;
                conn.style.opacity = '';
                this.activeConnections.delete(conn);
            }
        });
    }

    findNearestNeuron(x, y) {
        return this.neurons.reduce((closest, neuron) => {
            const rect = neuron.getBoundingClientRect();
            const nx = rect.left + rect.width / 2;
            const ny = rect.top + rect.height / 2;
            const distance = Math.sqrt(Math.pow(nx - x, 2) + Math.pow(ny - y, 2));

            if (distance < 30) { // Threshold jarak maksimal
                return { neuron, distance };
            }
            return closest;
        }, null)?.neuron;
    }

    pullNeuronTowardMouse(neuron, intensity) {
        const rect = neuron.getBoundingClientRect();
        const nx = rect.left + rect.width / 2;
        const ny = rect.top + rect.height / 2;

        const angle = Math.atan2(
            this.mouseY - ny,
            this.mouseX - nx
        );

        const pullDistance = 15 * intensity;

        neuron.style.transform = `
            translate(${Math.cos(angle) * pullDistance}px, ${Math.sin(angle) * pullDistance}px)
            scale(${1 + intensity * 0.5})
        `;
        neuron.style.boxShadow = `0 0 ${10 * intensity}px var(--neuro-accent)`;
    }

    createConnections(count) {
        for (let i = 0; i < count; i++) {
            const connection = document.createElement('div');
            connection.className = 'connection';

            // Posisi acak
            const x1 = Math.random() * 100;
            const y1 = Math.random() * 100;
            const x2 = x1 + (Math.random() * 20 - 10);
            const y2 = y1 + (Math.random() * 20 - 10);

            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

            // Simpan data posisi asli
            connection.dataset.startX = x1;
            connection.dataset.startY = y1;
            connection.dataset.endX = x2;
            connection.dataset.endY = y2;

            connection.style.cssText = `
                left: ${x1}%;
                top: ${y1}%;
                width: ${length}%;
                transform: rotate(${angle}deg);
                animation-duration: ${5 + Math.random() * 10}s;
            `;

            this.container.appendChild(connection);
            this.connections.push(connection);
        }
    }

    updateNeuralInteractions() {
        const NEURON_REACT_DISTANCE = 120;
        const CONNECTION_REACT_DISTANCE = 150;

        this.neurons.forEach(neuron => {
            const rect = neuron.getBoundingClientRect();
            const neuronX = rect.left + rect.width / 2;
            const neuronY = rect.top + rect.height / 2;

            const dx = neuronX - this.mouseX;
            const dy = neuronY - this.mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < NEURON_REACT_DISTANCE) {
                // Calculate repulsion effect
                const force = (1 - distance / NEURON_REACT_DISTANCE) * 10;
                const angle = Math.atan2(dy, dx);

                // Apply repulsion transform
                neuron.style.transform = `
                    translate(${Math.cos(angle) * force}px, ${Math.sin(angle) * force}px)
                    scale(${1 + (1 - distance / NEURON_REACT_DISTANCE) * 0.5})
                `;

                // Glow effect
                neuron.style.boxShadow = `0 0 ${force * 3}px var(--neuro-accent)`;
            } else {
                neuron.style.transform = '';
                neuron.style.boxShadow = '';
            }
        });

        this.connections.forEach(conn => {
            const rect = conn.getBoundingClientRect();
            const midX = rect.left + rect.width / 2;
            const midY = rect.top + rect.height / 2;

            const distance = Math.sqrt(
                Math.pow(midX - this.mouseX, 2) +
                Math.pow(midY - this.mouseY, 2)
            );

            if (distance < CONNECTION_REACT_DISTANCE) {
                const intensity = (1 - distance / CONNECTION_REACT_DISTANCE) * 0.8;
                conn.style.opacity = 0.4 + intensity;
                conn.style.height = `${2 + intensity * 3}px`;
            } else {
                conn.style.opacity = '';
                conn.style.height = '';
            }
        });
    }

    createNeurons(count) {
        for (let i = 0; i < count; i++) {
            const neuron = document.createElement('div');
            neuron.className = 'neuron';

            // Random position
            const x = Math.random() * 100;
            const y = Math.random() * 100;

            // Random size
            const size = 6 + Math.random() * 8;

            // Random animation delay
            const delay = Math.random() * 5;

            neuron.style.cssText = `
                left: ${x}%;
                top: ${y}%;
                width: ${size}px;
                height: ${size}px;
                animation-delay: ${delay}s;
            `;

            this.container.appendChild(neuron);
            this.neurons.push(neuron);
        }
    }

    createConnections(count) {
        for (let i = 0; i < count; i++) {
            const connection = document.createElement('div');
            connection.className = 'connection';

            // Random position and dimensions
            const x1 = Math.random() * 100;
            const y1 = Math.random() * 100;
            const x2 = Math.random() * 100;
            const y2 = Math.random() * 100;

            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

            // Random animation duration
            const duration = 3 + Math.random() * 7;

            connection.style.cssText = `
                left: ${x1}%;
                top: ${y1}%;
                width: ${length}%;
                transform: rotate(${angle}deg);
                animation-duration: ${duration}s;
            `;

            this.container.appendChild(connection);
            this.connections.push(connection);
        }
    }

    animate() {
        // Animate neurons pulsing
        this.neurons.forEach(neuron => {
            neuron.style.animation = `pulse ${3 + Math.random() * 4}s infinite ease-in-out`;
        });

        // Animate connections flowing
        this.connections.forEach(conn => {
            conn.style.animation = `flow ${5 + Math.random() * 10}s infinite linear`;
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NeuralAnimation();
});