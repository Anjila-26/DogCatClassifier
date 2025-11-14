# Cat vs Dog Classifier

A beginner-friendly web app to classify images as either a cat or a dog using a trained deep learning model.

---

## Features
- Upload an image or paste an image URL
- Get instant prediction: Cat or Dog
- Simple, clean UI
- Powered by PyTorch and a custom-trained model

---

## Screenshot

![App Screenshot](screenshot/screenshot.png)

---

## How to Use
1. Open the app in your browser.
2. Paste an image URL or choose an image file.
3. Click **Predict** to see the result.

---

## Project Structure
- `apicatdog.py` — API backend for inference
- `index.html`, `style.css`, `script.js` — Frontend files
- `model1.pth` — Trained model file
- `cat-and-dog.ipynb` — Model training notebook

---

## Setup
1. Install Python dependencies:
	```bash
	pip install torch torchvision flask
	```
2. Run the backend:
	```bash
	python apicatdog.py
	```
3. Open `index.html` in your browser.

---

## License
MIT
