import { exec } from 'child_process';
import { config } from '../config/config.js';
import fetch from 'node-fetch';

class InstagramService {
    async getVideoInfo(url) {
        return new Promise((resolve, reject) => {
            const options = config.ytdlpOptions;
            const command = `yt-dlp --format "${options.format}" ${options.dumpJson ? '--dump-json' : ''} ${options.noWarnings ? '--no-warnings' : ''} ${options.verbose ? '--verbose' : ''} "${url}"`;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Hata: ${error}`);
                    console.error(`Stderr: ${stderr}`);
                    reject(new Error('Video bilgileri alınamadı'));
                    return;
                }

                try {
                    const videoInfo = JSON.parse(stdout);
                    
                    if (!videoInfo.url) {
                        reject(new Error('Video URL\'si bulunamadı'));
                        return;
                    }

                    const videoUrl = videoInfo.url.replace('http://', 'https://');
                    
                    resolve({
                        videoUrl: videoUrl,
                        downloadUrl: videoUrl,
                        thumbnail: videoInfo.thumbnail ? videoInfo.thumbnail.replace('http://', 'https://') : null,
                        filename: videoInfo.title ? `${videoInfo.title}.mp4` : 'instagram-video.mp4'
                    });
                } catch (parseError) {
                    console.error(`JSON parse hatası: ${parseError}`);
                    reject(new Error('Video bilgileri işlenemedi'));
                }
            });
        });
    }

    async downloadVideo(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Video indirilemedi');
            const arrayBuffer = await response.arrayBuffer();
            return Buffer.from(arrayBuffer);
        } catch (error) {
            console.error('Video indirme hatası:', error);
            throw error;
        }
    }
}

export default new InstagramService(); 