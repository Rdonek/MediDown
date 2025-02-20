import express from 'express';
import instagramService from '../services/instagram.service.js';
import facebookService from '../services/facebook.service.js';
import youtubeService from '../services/youtube.service.js';

const router = express.Router();

router.post('/download', async (req, res) => {
    try {
        const { url, platform } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL gerekli' });
        }

        let videoInfo;
        switch (platform) {
            case 'facebook':
                videoInfo = await facebookService.getVideoInfo(url);
                break;
            case 'youtube':
                videoInfo = await youtubeService.getVideoInfo(url);
                break;
            default:
                videoInfo = await instagramService.getVideoInfo(url);
        }
        
        res.json(videoInfo);
        
    } catch (error) {
        console.error(`Genel hata: ${error}`);
        res.status(500).json({ 
            error: 'Sunucu hatası',
            details: error.message
        });
    }
});

router.get('/download-video', async (req, res) => {
    try {
        const { url, filename, platform, format = 'mp4' } = req.query;

        if (!url) {
            return res.status(400).json({ error: 'Video URL\'si gerekli' });
        }

        let buffer;
        switch (platform) {
            case 'facebook':
                buffer = await facebookService.downloadVideo(url);
                break;
            case 'youtube':
                buffer = await youtubeService.downloadVideo(url, format);
                break;
            default:
                buffer = await instagramService.downloadVideo(url);
        }
        
        const contentType = format === 'mp3' ? 'audio/mpeg' : 'video/mp4';
        const extension = format === 'mp3' ? '.mp3' : '.mp4';
        
        // Dosya adını temizle ve encode et
        const cleanFilename = filename
            .replace(/[^\w\s-]/g, '') // Özel karakterleri kaldır
            .replace(/[\s]+/g, '-') // Boşlukları tire ile değiştir
            .replace(/[ğĞüÜşŞıİöÖçÇ]/g, c => { // Türkçe karakterleri dönüştür
                const tr = { 'ğ': 'g', 'Ğ': 'G', 'ü': 'u', 'Ü': 'U', 'ş': 's', 'Ş': 'S', 'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O', 'ç': 'c', 'Ç': 'C' };
                return tr[c];
            })
            .toLowerCase();
        
        const finalFilename = `${cleanFilename}${extension}`;
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${finalFilename}"`);
        res.send(buffer);

    } catch (error) {
        console.error(`İndirme hatası: ${error}`);
        res.status(500).json({ 
            error: 'İndirme hatası',
            details: error.message
        });
    }
});

export default router; 