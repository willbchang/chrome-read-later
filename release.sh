cd ~/Documents/Code/chrome-read-later
mkdir ~/Desktop/chrome-read-later/
cp -R assets core components modules manifest.json ~/Desktop/chrome-read-later
cd ~/Desktop/chrome-read-later
rm -r assets/images
cd ..
zip -r chrome-read-later.zip chrome-read-later
