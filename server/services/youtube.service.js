import { exec } from 'child_process';
import { config } from '../config/config.js';
import fetch from 'node-fetch';
import { promisify } from 'util';

const execAsync = promisify(exec);

class YouTubeService {
    async getVideoInfo(url) {
        try {
            // Önce video bilgilerini al
            const { stdout: info } = await execAsync(`yt-dlp -j "${url}"`);
            const videoInfo = JSON.parse(info);

            // Sonra en iyi formatı bul
            const { stdout: formats } = await execAsync(`yt-dlp -F "${url}"`);
            
            // Video URL'sini al
            const { stdout: directUrl } = await execAsync(`yt-dlp -f "best" -g "${url}"`);

            // Başlığı temizle
            const cleanTitle = videoInfo.title
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s]+/g, '-')
                .replace(/[ğĞüÜşŞıİöÖçÇ]/g, c => {
                    const tr = { 'ğ': 'g', 'Ğ': 'G', 'ü': 'u', 'Ü': 'U', 'ş': 's', 'Ş': 'S', 'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O', 'ç': 'c', 'Ç': 'C' };
                    return tr[c];
                })
                .toLowerCase();

            return {
                videoUrl: directUrl.trim(),
                downloadUrl: directUrl.trim(),
                thumbnail: videoInfo.thumbnail,
                filename: `${cleanTitle}.mp4`,
                title: videoInfo.title
            };
        } catch (error) {
            console.error('Video bilgileri alınamadı:', error);
            throw new Error('Video bilgileri alınamadı');
        }
    }

    async downloadVideo(url, format = 'mp4') {
        try {
            const tempFilename = `temp-${Date.now()}.${format}`;
            let command;

            if (format === 'mp3') {
                command = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${tempFilename}" "${url}"`;
            } else {
                command = `yt-dlp -f "best" -o "${tempFilename}" "${url}"`;
            }

            await execAsync(command);
            
            // Dosyayı buffer olarak oku ve sil
            const fs = await import('fs/promises');
            const buffer = await fs.readFile(tempFilename);
            await fs.unlink(tempFilename);
            
            return buffer;
        } catch (error) {
            console.error('İndirme hatası:', error);
            throw new Error(`${format.toUpperCase()} formatında indirme başarısız oldu`);
        }
    }
}

export default new YouTubeService(); 