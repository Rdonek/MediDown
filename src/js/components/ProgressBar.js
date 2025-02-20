class ProgressBar {
    constructor(container) {
        this.container = container;
        this.progressContainer = null;
        this.progressBar = null;
        this.statusText = null;
        this.initialize();
    }

    initialize() {
        // İlerleme çubuğu container'ı
        this.progressContainer = document.createElement('div');
        this.progressContainer.className = 'download-progress';

        // İlerleme çubuğu
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'progress-bar';
        this.progressContainer.appendChild(this.progressBar);

        // Durum metni
        this.statusText = document.createElement('div');
        this.statusText.className = 'download-status';

        // Container'a ekle
        this.container.appendChild(this.progressContainer);
        this.container.appendChild(this.statusText);
    }

    updateProgress(progress) {
        requestAnimationFrame(() => {
            this.progressBar.style.width = `${progress}%`;
            this.progressBar.style.transition = 'width 0.3s ease-in-out';
            
            if (progress === 100) {
                this.progressBar.classList.add('complete');
            } else {
                this.progressBar.classList.remove('complete');
            }
        });
    }

    setStatus(message) {
        this.statusText.textContent = message;
        this.statusText.classList.add('fade-in');
    }

    show() {
        this.progressContainer.style.display = 'block';
        this.statusText.style.display = 'block';
        this.progressBar.style.width = '0%';
        this.progressBar.classList.remove('complete');
        this.statusText.classList.remove('fade-in');
    }

    hide() {
        this.progressContainer.style.display = 'none';
        this.statusText.style.display = 'none';
    }

    reset() {
        this.progressBar.style.width = '0';
        this.statusText.textContent = '';
        this.progressBar.classList.remove('complete');
        this.hide();
    }
}

export default ProgressBar; 