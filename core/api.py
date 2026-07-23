# IMPORT SECTION
from fastapi import FastAPI, File, HTTPException, Body, Request, requests
from starlette.datastructures import UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from embedding import predict_image
from io import BytesIO
from PIL import Image
import requests
app = FastAPI()

#Pydantic Model to validate incoming result data
class Prediction(BaseModel):
    result: int
    probability_real: float
    probability_ai: float

# ACCEPTABLE ORIGINS
origins = ["http://localhost:5173", "http://127.0.0.1:5173"] 
# CORS_MIDDLEWARE TO PREVENT CORS ISSUE
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
    
# END POINT TO PREDICT IMAGE TYPE
@app.post("/predict", response_model=list[Prediction])
async def predict_image_class(request: Request) -> list[Prediction]:
    #Recieve request and extract image list 

    form = await request.form()
    input = form.getlist("images")
    if not input:
         raise HTTPException(status_code=400, detail="No images recieved")

    image_bytes: list[bytes] = []

    for image in input:
        #Read in value as bytes for passing to predictor
        if isinstance(image, str):
            try:
                response = requests.get(image)
                image_data = response.content
            except requests.RequestException:
                raise HTTPException(status_code=400, detail=f"unable to retrieve URL: {image}")
        elif isinstance(image, UploadFile):
              image_data = await image.read()
        else:
            raise HTTPException(status_code=400, detail="Invalid Input Detected")
        #Verify Files are uncorrupted      
        try:
            with Image.open(BytesIO(image_data)) as current_image:
                current_image.verify()
        except Exception as e:
            raise HTTPException(status_code=400, detail="Image corrupted or invalid")
        image_bytes.append(image_data)

    #Attempt prediction, throw error during failure
    try:
        predictions = predict_image(image_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to Predict Image: " + str(e))
    
    for prediction in predictions:
        #Validate Result fits 1 or 0 (real or fake)
        if prediction["result"] != 0 or prediction["result"] != 1:
            HTTPException(status_code=500, detail="Invalid prediction result") 
            
        #Validate Probabilities fall within proper range, 0-100%
        if not 0 <= prediction["probability_real"] <= 1:
            raise HTTPException(status_code=500, detail="Invalid prediction result") 
        
        if not 0 <= prediction["probability_ai"] <= 1:
            raise HTTPException(status_code=500, detail="Invalid prediction result") 
    return predictions
    