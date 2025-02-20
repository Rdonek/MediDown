export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const createDownloadFileName = (url) => {
    const date = new Date().toISOString().slice(0, 10);
    return `instagram-reels-${date}.mp4`;
};

export const showElement = (element) => {
    if (element) element.style.display = 'block';
};

export const hideElement = (element) => {
    if (element) element.style.display = 'none';
}; 