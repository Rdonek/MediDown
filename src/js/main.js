import { MESSAGES } from './config/constants.js';
import { isValidInstagramUrl, isValidFacebookUrl, isValidYouTubeUrl } from './utils/validation.js';
import { createDownloadFileName } from './utils/helpers.js';
import apiService from './services/api.service.js';
import VideoPlayer from './components/VideoPlayer.js';
import ProgressBar from './components/ProgressBar.js';

class App {
    constructor() {
        this.urlInput = document.getElementById('reelsUrl');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.previewContainer = document.getElementById('preview');
        this.errorDiv = document.getElementById('error');
        this.instagramBtn = document.getElementById('instagramBtn');
        this.facebookBtn = document.getElementById('facebookBtn');
        this.youtubeBtn = document.getElementById('youtubeBtn');
        this.formatSelector = document.getElementById('formatSelector');
        this.mp4Btn = document.getElementById('mp4Btn');
        this.mp3Btn = document.getElementById('mp3Btn');

        this.videoPlayer = new VideoPlayer(this.previewContainer);
        this.progressBar = new ProgressBar(this.previewContainer);
        this.selectedPlatform = null;
        this.currentVideoData = null;

        this.initialize();
    }

    initialize() {
        this.downloadBtn.addEventListener('click', this.handleDownload.bind(this));
        this.instagramBtn.addEventListener('click', () => this.selectPlatform('instagram'));
        this.facebookBtn.addEventListener('click', () => this.selectPlatform('facebook'));
        this.youtubeBtn.addEventListener('click', () => this.selectPlatform('youtube'));
        this.mp4Btn.addEventListener('click', () => this.handleFormatSelect('mp4'));
        this.mp3Btn.addEventListener('click', () => this.handleFormatSelect('mp3'));
        this.downloadBtn.disabled = true;
        
        // Loading spinner'ı ekle
        this.downloadBtn.innerHTML = `
            <span class="loading-spinner"></span>
            <span class="loading-text">Video Bilgilerini Getir</span>
        `;
    }

    setLoading(isLoading, text = '') {
        if (isLoading) {
            this.downloadBtn.classList.add('loading');
            this.downloadBtn.disabled = true;
            this.downloadBtn.querySelector('.loading-text').textContent = text;
            this.downloadBtn.querySelector('.loading-text').classList.add('loading-dots');
        } else {
            this.downloadBtn.classList.remove('loading');
            this.downloadBtn.disabled = false;
            this.downloadBtn.querySelector('.loading-text').textContent = 'Video Bilgilerini Getir';
            this.downloadBtn.querySelector('.loading-text').classList.remove('loading-dots');
        }
    }

    selectPlatform(platform) {
        this.selectedPlatform = platform;
        this.downloadBtn.disabled = false;
        this.formatSelector.style.display = 'none';

        // Buton stillerini güncelle
        this.instagramBtn.classList.remove('active');
        this.facebookBtn.classList.remove('active');
        this.youtubeBtn.classList.remove('active');

        switch (platform) {
            case 'instagram':
                this.instagramBtn.classList.add('active');
                this.urlInput.placeholder = 'Instagram video URL\'sini yapıştırın';
                break;
            case 'facebook':
                this.facebookBtn.classList.add('active');
                this.urlInput.placeholder = 'Facebook video URL\'sini yapıştırın';
                break;
            case 'youtube':
                this.youtubeBtn.classList.add('active');
                this.urlInput.placeholder = 'YouTube video URL\'sini yapıştırın';
                break;
        }

        // Input içeriğini temizle
        this.urlInput.value = '';
        this.errorDiv.style.display = 'none';
        this.videoPlayer.hide();
    }

    showError(message) {
        this.errorDiv.textContent = message;
        this.errorDiv.style.display = 'block';
        this.videoPlayer.hide();
        this.formatSelector.style.display = 'none';
    }

    validateUrl(url) {
        switch (this.selectedPlatform) {
            case 'instagram':
                if (!isValidInstagramUrl(url)) {
                    this.showError('Geçerli bir Instagram video URL\'si girin');
                    return false;
                }
                break;
            case 'facebook':
                if (!isValidFacebookUrl(url)) {
                    this.showError('Geçerli bir Facebook video URL\'si girin');
                    return false;
                }
                break;
            case 'youtube':
                if (!isValidYouTubeUrl(url)) {
                    this.showError('Geçerli bir YouTube video URL\'si girin');
                    return false;
                }
                break;
        }
        return true;
    }

    async handleDownload() {
        const url = this.urlInput.value.trim();
        
        if (!url) {
            this.showError(MESSAGES.EMPTY_URL);
            return;
        }

        if (!this.selectedPlatform) {
            this.showError('Lütfen önce platform seçin');
            return;
        }

        if (!this.validateUrl(url)) {
            return;
        }

        try {
            this.setLoading(true, 'Video bilgileri alınıyor');

            const data = await apiService.getVideoInfo(url, this.selectedPlatform);
            this.currentVideoData = data;
            
            this.videoPlayer.clear();
            
            const video = this.videoPlayer.createVideoElement(data.videoUrl);
            
            // YouTube için format seçimi göster
            if (this.selectedPlatform === 'youtube') {
                this.formatSelector.style.display = 'block';
            } else {
                const downloadLink = this.createDownloadLink(data, 'mp4');
                this.previewContainer.appendChild(downloadLink);
            }

            this.previewContainer.appendChild(video);
            this.videoPlayer.show();
            this.errorDiv.style.display = 'none';

        } catch (error) {
            this.showError(MESSAGES.FETCH_ERROR);
        } finally {
            this.setLoading(false);
        }
    }

    createDownloadLink(data, format) {
        const downloadLink = document.createElement('a');
        const filename = format === 'mp3' ? data.filename.replace('.mp4', '.mp3') : data.filename;
        downloadLink.href = `/api/download-video?url=${encodeURIComponent(data.downloadUrl)}&filename=${encodeURIComponent(filename)}&platform=${this.selectedPlatform}&format=${format}`;
        downloadLink.className = 'download-link';
        downloadLink.innerHTML = `
            <span class="loading-spinner"></span>
            <span class="loading-text">${format === 'mp3' ? 'MP3 İndir' : 'Videoyu İndir'}</span>
        `;
        downloadLink.download = filename;
        downloadLink.addEventListener('click', this.handleVideoDownload.bind(this));
        return downloadLink;
    }

    handleFormatSelect(format) {
        if (!this.currentVideoData) return;

        // Mevcut indirme butonlarını kaldır
        const existingLinks = this.previewContainer.querySelectorAll('.download-link');
        existingLinks.forEach(link => link.remove());

        // Yeni indirme butonu ekle
        const downloadLink = this.createDownloadLink(this.currentVideoData, format);
        this.previewContainer.appendChild(downloadLink);
    }

    async handleVideoDownload(event) {
        event.preventDefault();
        const downloadLink = event.target.closest('.download-link');
        if (!downloadLink) return;
        
        try {
            downloadLink.classList.add('loading');
            const loadingText = downloadLink.querySelector('.loading-text');
            loadingText.textContent = 'İndirme başladı %0';
            loadingText.classList.add('loading-dots');
            downloadLink.style.pointerEvents = 'none';
            
            this.progressBar.show();
            this.progressBar.setStatus('İndirme başladı %0');
            
            const response = await fetch(downloadLink.href);
            if (!response.ok) throw new Error('İndirme başarısız oldu');
            
            const reader = response.body.getReader();
            const contentLength = response.headers.get('content-length');
            const totalLength = parseInt(contentLength, 10);
            let receivedLength = 0;

            while(true) {
                const {done, value} = await reader.read();
                
                if (done) {
                    break;
                }
                
                receivedLength += value.length;
                const progress = (receivedLength / totalLength) * 100;
                const progressText = Math.round(progress);
                
                this.progressBar.updateProgress(progress);
                this.progressBar.setStatus(`İndirme devam ediyor %${progressText}`);
                loadingText.textContent = `İndirme devam ediyor %${progressText}`;
                loadingText.classList.add('loading-dots');
            }

            const response2 = await fetch(downloadLink.href);
            const blob = await response2.blob();
            const url = window.URL.createObjectURL(blob);
            
            const tempLink = document.createElement('a');
            tempLink.href = url;
            tempLink.download = downloadLink.download;
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(url);

            this.progressBar.updateProgress(100);
            this.progressBar.setStatus('İndirme tamamlandı! %100');
            loadingText.textContent = 'İndirme tamamlandı! %100';
            loadingText.classList.remove('loading-dots');
            downloadLink.classList.remove('loading');
            
            setTimeout(() => {
                this.progressBar.hide();
                downloadLink.style.pointerEvents = 'auto';
                loadingText.textContent = downloadLink.download.endsWith('.mp3') ? 'MP3 İndir' : 'Videoyu İndir';
            }, 2000);

        } catch (error) {
            this.progressBar.setStatus(MESSAGES.DOWNLOAD_ERROR);
            const loadingText = downloadLink.querySelector('.loading-text');
            loadingText.textContent = MESSAGES.DOWNLOAD_ERROR;
            loadingText.classList.remove('loading-dots');
            downloadLink.classList.remove('loading');
            
            setTimeout(() => {
                this.progressBar.hide();
                downloadLink.style.pointerEvents = 'auto';
                loadingText.textContent = downloadLink.download.endsWith('.mp3') ? 'MP3 İndir' : 'Videoyu İndir';
            }, 2000);
        }
    }
}

// Uygulama başlatma
document.addEventListener('DOMContentLoaded', () => {
    new App();
}); 