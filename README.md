# Deteksi Retinopati Retina - UAS Data Sains

Aplikasi ini digunakan untuk mendeteksi kondisi retina berdasarkan gambar yang diunggah, menggunakan model CNN dan antarmuka web berbasis Flask.

## Fitur Utama
- Upload gambar retina (.jpg, .png)
- Prediksi: Normal Retina atau Retinopathy Retina
- Menampilkan hasil confidence (tingkat keyakinan model)

## 🛠 Teknologi yang Digunakan
- Python + TensorFlow (model .h5)
- Flask (API backend)
- HTML + CSS + JS + Bootsrap (Frontend)
- Git + GitHub (versi kontrol & dokumentasi)

## 📁 Struktur Folder
📦 Deteksi_retina/
┣ 📂 templates/
┃ ┗ 📄 deteksi.html
┣ 📄 app.py
┣ 📄 retina_v2.h5
┣ 📄 README.md

## ==================================
## =========CARA MENJALANKAN=========
## ==================================

### 1. Install library yang dibutuhkan
pip install flask tensorflow pillow numpy

python otomatis akan menginstall library library yang dibutuhkan untuk menjalankan server web 

### 2. Jalankan app.py
bisa melalui terminal atau langsung dari file python
Tunggu sampai muncul server flask terminal seperti contoh dibawah ini :

INFO:werkzeug:WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
INFO:werkzeug:Press CTRL+C to quit
INFO:werkzeug: * Restarting

klik ctrl + klik kiri atau langsung copy url server local host port 5000 tersebut dan letakan didalam browser

### 3. Klik Icon Tambah
### 4. Masukan Gambar
### 5. Lalu ketika gambar sudah masuk diform GUI
### 6. Klik Analyze 
Otomatis gambar akan dikirim ke server flask, dan flask akan mengirim gambar tersebut ke model untuk diprediksi