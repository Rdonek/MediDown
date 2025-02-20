FROM node:18

# FFmpeg kurulumu
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean

# Python ve pip kurulumu
RUN apt-get install -y python3-pip

# yt-dlp kurulumu
RUN pip3 install yt-dlp

# Uygulama dizini oluşturma
WORKDIR /app

# Package.json ve package-lock.json kopyalama
COPY package*.json ./

# Bağımlılıkları yükleme
RUN npm install

# Tüm dosyaları kopyalama
COPY . .

# Port ayarı
EXPOSE 10000

# Uygulamayı başlatma
CMD ["node", "server/server.js"] 