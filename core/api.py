# IMPORT SECTION
from fastapi import FastAPI, File, UploadFile, HTTPException, Body
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

# TEMPORARY END POINT TO CREATE FUNCTIONALITY FOR URL UPLOADINGS
@app.post("/predictURL", response_model=Prediction)
async def predict_image_url_class(url: str = Body(...)) -> Prediction:
    response = requests.get(url)
    image_bytes = response.content
    try:
        Image.open(BytesIO(image_bytes)).verify()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Image corrupted or invalid")
    
    try:
        prediction = predict_image(image_bytes)

    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to Predict Image: " + str(e))
    
    #Validate Result fits 1 or 0 (real or fake)
    if prediction["result"] != 0 or prediction["result"] != 1:
        HTTPException(status_code=500, detail="Invalid prediction result") 
        
    #Validate Probabilities fall within proper range, 0-100%
    if not 0 <= prediction["probability_real"] <= 1:
        raise HTTPException(status_code=500, detail="Invalid prediction result") 
    
    if not 0 <= prediction["probability_ai"] <= 1:
        raise HTTPException(status_code=500, detail="Invalid prediction result") 
    
    return prediction
    
# END POINT TO PREDICT IMAGE TYPE
@app.post("/predict", response_model=list[Prediction])
async def predict_image_class(files: list[UploadFile] = File(...)) -> list[Prediction]:
    #Validate image is uncorrupted and is a valid image
    try:
        for file in files:
            Image.open(file.file).verify()
            file.file.seek(0)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Image corrupted or invalid")

    #Read in value as bytes for passing to predictor
    input = []
    for file in files:
        input.append(await file.read())

        #Validate image has arrived before continuing
        if not input:
            raise HTTPException(status_code=400, detail="No image recieved")
    #Attempt prediction, throw error during failure
    try:
        predictions = predict_image(input)
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
    