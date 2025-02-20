import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.routes.js';
import { config } from './config/config.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

// Ortam değişkenlerini yükle
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Güvenlik middleware'leri
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            mediaSrc: [
                "'self'", 
                "https://*.fbcdn.net", 
                "https://*.instagram.com", 
                "https://*.cdninstagram.com",
                "https://*.googlevideo.com",
                "https://*.youtube.com",
                "https://youtube.com",
                "https://*.ytimg.com",
                "blob:"
            ],
            imgSrc: [
                "'self'", 
                "https://*.fbcdn.net", 
                "https://*.instagram.com", 
                "https://*.cdninstagram.com",
                "https://*.googlevideo.com",
                "https://*.youtube.com",
                "https://youtube.com",
                "https://*.ytimg.com",
                "data:", 
                "blob:"
            ],
            connectSrc: [
                "'self'", 
                "https://*.fbcdn.net", 
                "https://*.instagram.com", 
                "https://*.cdninstagram.com",
                "https://*.googlevideo.com",
                "https://*.youtube.com",
                "https://youtube.com",
                "https://*.ytimg.com"
            ],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            frameSrc: ["'self'", "https://*.youtube.com"],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["'self'", "blob:"],
            objectSrc: ["'none'"],
            manifestSrc: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false
}));
app.use(cors());
app.use(compression());

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Statik dosyalar
app.use(express.static(path.join(__dirname, '../src')));

// API rotaları
app.use('/api', apiRoutes);

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

// Favicon endpoint'i
app.get('/favicon.png', (req, res) => {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.sendFile(path.join(__dirname, '../src/assets/images/favicon.png'));
});

// 404 ve hata yönetimi
app.use(notFound);
app.use(errorHandler);

// Sunucuyu başlat
const PORT = process.env.PORT || config.port;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor (${process.env.NODE_ENV} modu)`);
}); 