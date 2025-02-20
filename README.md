# Medidown - Sosyal Medya Video İndirici

Modern ve kullanıcı dostu arayüzü ile Instagram, Facebook ve YouTube videolarını kolayca indirmenizi sağlayan web uygulaması.

## 🚀 Özellikler

- 📱 Instagram Reels ve Post video indirme
- 📘 Facebook video indirme desteği
- 🎥 YouTube video indirme (MP4)
- 🎵 YouTube ses indirme (MP3)
- 📊 Gerçek zamanlı indirme durumu
- 🎨 Modern ve responsive tasarım
- 🔒 Güvenli indirme işlemi
- 🌐 Türkçe karakter desteği

## 🛠️ Teknolojiler

- Node.js
- Express.js
- yt-dlp
- FFmpeg
- Modern JavaScript (ES6+)
- HTML5 & CSS3

## 📋 Gereksinimler

- Node.js >= 14.x
- yt-dlp (sistem üzerinde kurulu olmalı)
- FFmpeg (sistem üzerinde kurulu olmalı)

## ⚙️ Kurulum

1. Depoyu klonlayın:
```bash
git clone https://github.com/kullaniciadi/medidown.git
cd medidown
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. FFmpeg kurulumu:
```bash
# Windows için (winget ile)
winget install ffmpeg

# Linux için
sudo apt-get install ffmpeg

# macOS için
brew install ffmpeg
```

4. yt-dlp kurulumu:
```bash
# pip ile kurulum
pip install yt-dlp
```

5. .env dosyasını oluşturun:
```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## 🚀 Çalıştırma

Geliştirme modu için:
```bash
npm run dev
```

Üretim modu için:
```bash
npm run prod
```

## 📝 Kullanım

1. Tarayıcınızda `http://localhost:3000` adresine gidin
2. Platform seçin (Instagram, Facebook veya YouTube)
3. Video URL'sini yapıştırın
4. "Video Bilgilerini Getir" butonuna tıklayın
5. YouTube için format seçin (MP4 veya MP3)
6. İndirme butonuna tıklayın

## 🔒 Güvenlik Özellikleri

- Helmet.js ile güvenlik başlıkları
- Content Security Policy (CSP)
- Rate limiting
- Input validasyonu
- Güvenli dosya işlemleri

## 🎯 API Endpoints

### Video Bilgisi Alma
```http
POST /api/download
Content-Type: application/json

{
  "url": "video_url",
  "platform": "youtube|facebook|instagram"
}
```

### Video İndirme
```http
GET /api/download-video?url=video_url&filename=dosya_adi&platform=youtube&format=mp4
```

## 📱 Responsive Tasarım

- Mobil öncelikli tasarım
- Tüm ekran boyutlarına uyumlu
- Modern ve kullanıcı dostu arayüz
- Yükleme durumu göstergeleri

## 🔧 Geliştirme

Kod formatı kontrolü:
```bash
npm run format
```

Lint kontrolü:
```bash
npm run lint
```

## 🤝 Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/yeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik: Açıklama'`)
4. Branch'inizi push edin (`git push origin feature/yeniOzellik`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

## ⚠️ Yasal Uyarı

Bu uygulama sadece eğitim amaçlıdır. Telif hakkı olan içeriklerin indirilmesi ve dağıtılması yasalara aykırı olabilir. Lütfen yerel telif hakkı yasalarına uyun. 