from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def home():
    return render_template('deteksi.html')

if __name__ == '__main__':
    app.run(debug=True)  # Auto-reload saat ada perubahan kode