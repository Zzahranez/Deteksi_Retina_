from flask import Flask, request, jsonify, render_template
import tensorflow as tf
from PIL import Image
import numpy as np

app = Flask(__name__)


model = tf.keras.models.load_model(r"D:\Data Sains dan Analitis\Pertemuan 16 Project Akhir\Deteksi_retina\retina_v2.h5")

class_labels = ['Retina Normal', 'Retinopathy Retina',] 

@app.route("/")
def index():
    return render_template('deteksi.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'Tidak ada file gambar'})
    
    file = request.files['file']
    img = Image.open(file).resize((128, 128))
    img_array = np.array(img) / 255.
    img_array = np.expand_dims(img_array, axis=0)


    # Prediksi gambar menggunakan model
    prediction = model.predict(img_array)
    print("Nilai Prediksi:", prediction)

    # Tentukan kelas berdasarkan nilai prediksi
    if prediction[0][0] > 0.5:
        predicted_class = 'Retinopathy Retina'
    elif prediction[0][0] <= 0.5:
        predicted_class = 'Normal Retina'
    else:
        predicted_class = 'Retina tidak diketahui'

    print("Kelas yang diprediksi:", predicted_class)
    hasil_prediksi = {
        'diagnosis': predicted_class,
        'confidence': float(prediction[0][0]) 
    }

    return jsonify(hasil_prediksi)


if __name__ == '__main__':
    app.run(debug=True)
