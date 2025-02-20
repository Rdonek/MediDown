import { API_ENDPOINTS } from '../config/constants.js';

class ApiService {
    async getVideoInfo(url, platform) {
        const response = await fetch(API_ENDPOINTS.DOWNLOAD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url, platform })
        });

        if (!response.ok) {
            throw new Error('Video bilgileri alınamadı');
        }

        return response.json();
    }

    async downloadVideo(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Video indirilemedi');
        return response;
    }
}

export default new ApiService(); 