export const isValidInstagramUrl = (url) => {
    return url.includes('instagram.com/reel/') || url.includes('instagram.com/p/');
};

export const isValidFacebookUrl = (url) => {
    return url.includes('facebook.com/') && (
        url.includes('/videos/') || 
        url.includes('/watch/') || 
        url.includes('/reel/') || 
        url.includes('/share/') ||
        url.includes('/story/')
    );
};

export const isValidYouTubeUrl = (url) => {
    return (
        url.includes('youtube.com/watch?v=') || 
        url.includes('youtu.be/') ||
        url.includes('youtube.com/shorts/')
    );
};

export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const getPlatform = (url) => {
    if (isValidInstagramUrl(url)) return 'instagram';
    if (isValidFacebookUrl(url)) return 'facebook';
    if (isValidYouTubeUrl(url)) return 'youtube';
    return null;
}; 