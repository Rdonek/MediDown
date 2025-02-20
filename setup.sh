#!/bin/bash

# FFmpeg kurulumu
echo "FFmpeg kurulumu başlıyor..."
apt-get update && apt-get install -y ffmpeg

# Python ve pip kurulumu
echo "Python ve pip kurulumu başlıyor..."
apt-get install -y python3-pip

# yt-dlp kurulumu
echo "yt-dlp kurulumu başlıyor..."
pip3 install yt-dlp --break-system-packages

echo "Kurulum tamamlandı!" 