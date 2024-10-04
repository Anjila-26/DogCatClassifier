from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch 
from torchvision import transforms
from fastapi.responses import JSONResponse
import torchvision.models as models
from PIL import Image
import io
import requests

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
    
# Initialize the model
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
model = models.resnet50(pretrained=False)
model.fc = torch.nn.Linear(model.fc.in_features, 2)  # Adjust the final layer for binary classification

# Load the model weights, map to CPU if no GPU is available
model.load_state_dict(torch.load('model1.pth', map_location=device))  # Use the correct file path for your weights
model.to(device)
model.eval()

transform = transforms.Compose([
    transforms.Resize((128, 128)),  # Resize images to 128x128
    transforms.ToTensor(),          # Convert the image to a tensor
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  # Normalize as in ImageNet
])

# Define a Pydantic model for the response
class PredictionResponse(BaseModel):
    label: str

@app.post("/predict/", response_model=PredictionResponse)
async def predict_image(file: UploadFile = File(None), url: str = Form(None)):
    print(f"Received file: {file}")
    print(f"Received URL: {url}")
    try:
        if file:
            contents = await file.read()
            image = Image.open(io.BytesIO(contents))
        elif url:
            response = requests.get(url)
            image = Image.open(io.BytesIO(response.content))
        else:
            return JSONResponse(content={"error": "No file or URL provided"}, status_code=400)
        
        # Preprocess image
        image = transform(image).unsqueeze(0).to(device)
        
        # Make prediction
        with torch.no_grad():
            outputs = model(image)
            _, predicted = torch.max(outputs, 1)
            prediction = "Dog" if predicted.item() == 1 else "Cat"
            
        return PredictionResponse(label=prediction)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)