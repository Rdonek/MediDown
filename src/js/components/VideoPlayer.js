class VideoPlayer {
    constructor(container) {
        this.container = container;
    }

    createVideoElement(videoUrl) {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.controls = true;
        video.className = 'video-preview';
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
        return video;
    }

    createDownloadButton(downloadUrl, filename) {
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.className = 'download-link';
        downloadLink.textContent = 'Videoyu İndir';
        downloadLink.download = filename;
        return downloadLink;
    }

    clear() {
        this.container.innerHTML = '';
    }

    show() {
        this.container.classList.add('active');
    }

    hide() {
        this.container.classList.remove('active');
    }
}

export default VideoPlayer; 