from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pdf2image import convert_from_path
import pytesseract
import matplotlib.pyplot as plt
import numpy as np
import cv2
import os
import tempfile
from typing import Dict
from PIL import Image
from pydantic import BaseModel
import uuid
import re
from pymongo import MongoClient
from datetime import datetime
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB Configuration
try:
    MONGO_URI = os.getenv("MONGO_URI")
    DB_NAME = os.getenv("MONGO_DB_NAME")
    COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME")

    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.server_info()
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    logger.info("Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"Could not connect to MongoDB: {e}")
    raise RuntimeError("Database connection failed")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths from env
POPPLER_PATH = os.getenv("POPPLER_PATH")
TESSERACT_ENGINE_PATH = os.getenv("TESSERACT_ENGINE_PATH")
pytesseract.pytesseract.tesseract_cmd = TESSERACT_ENGINE_PATH

# Store processed images temporarily
PROCESSED_IMAGES = {}

class ExtractionResponse(BaseModel):
    original_text: str
    processed_text: str
    cleaned_text: str
    image_id: str
    message: str

def preprocess_image(img: Image.Image) -> np.ndarray:
    """Enhanced image preprocessing for better OCR results"""
    if isinstance(img, Image.Image):
        img = np.array(img)
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    denoised = cv2.fastNlMeansDenoising(gray, h=10)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    contrast_enhanced = clahe.apply(denoised)
    
    processed_image = cv2.adaptiveThreshold(
        contrast_enhanced,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        61,
        11
    )
    
    return processed_image

def clean_ocr_text(text: str) -> str:
    """Clean and format OCR output text"""
    text = re.sub(r'\n\s*\n', '\n\n', text)
    text = re.sub(r'[^\S\n]+', ' ', text)
    
    replacements = {
        r'\bRp\b': 'Prescription',
        r'\bint\b': 'init',
        r'\bwwew\b': 'www'
    }
    
    for pattern, replacement in replacements.items():
        text = re.sub(pattern, replacement, text)
    
    return text.strip()

@app.post("/extract-text", response_model=ExtractionResponse)
async def extract_text_from_pdf(
    file: UploadFile = File(...),
    user_email: str = Form(None)
):
    """Enhanced endpoint to extract text from uploaded PDF"""
    try:
        logger.info(f"Starting processing for {file.filename}")
        
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are accepted")

        # Create temp directory
        with tempfile.TemporaryDirectory() as temp_dir:
            logger.info(f"Created temp directory: {temp_dir}")
            
            # Save uploaded file temporarily
            temp_pdf_path = os.path.join(temp_dir, "uploaded.pdf")
            with open(temp_pdf_path, "wb") as buffer:
                buffer.write(await file.read())

            # Convert PDF to image
            logger.info("Converting PDF to images...")
            pages = convert_from_path(
                temp_pdf_path, 
                poppler_path=POPPLER_PATH,
                dpi=300,
                first_page=1,
                last_page=1
            )
            
            if not pages:
                raise HTTPException(status_code=400, detail="No pages found in PDF")

            # Generate unique ID
            image_id = str(uuid.uuid4())
            
            # Save original image
            original_img_path = os.path.join(temp_dir, f"{image_id}_original.png")
            pages[0].save(original_img_path, "PNG", quality=95)

            # Extract text from original image
            logger.info("Extracting text from original image...")
            original_text = pytesseract.image_to_string(
                pages[0], 
                lang="eng",
                config="--psm 6 --oem 3"
            )

            # Process image
            processed_img = preprocess_image(pages[0])
            processed_img_path = os.path.join(temp_dir, f"{image_id}_processed.png")
            plt.imsave(processed_img_path, processed_img, cmap="gray", dpi=300)

            # Extract text from processed image
            processed_text = pytesseract.image_to_string(
                processed_img,
                lang="eng",
                config="--psm 6 --oem 3 -c preserve_interword_spaces=1"
            )

            # Clean text
            cleaned_text = clean_ocr_text(processed_text)

            # Store image paths
            PROCESSED_IMAGES[image_id] = {
                "original": original_img_path,
                "processed": processed_img_path
            }

            # Prepare data for MongoDB
            data = {
                "user_email": user_email,
                "original_text": original_text,
                "processed_text": processed_text,
                "cleaned_text": cleaned_text,
                "image_id": image_id,
                "message": "Text extraction completed",
                "timestamp": datetime.now(),
                "filename": file.filename
            }

            # Save to MongoDB
            logger.info("Saving to MongoDB...")
            collection.insert_one(data)
            logger.info("Successfully saved to MongoDB")

            return {
                "original_text": original_text,
                "processed_text": processed_text,
                "cleaned_text": cleaned_text,
                "image_id": image_id,
                "message": f"Use /view-image/{image_id}/original or /view-image/{image_id}/processed to view images"
            }

    except Exception as e:
        logger.error(f"Error processing file: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.get("/user-prescriptions")
async def get_user_prescriptions(user_email: str):
    """Endpoint to get all prescriptions for a specific user"""
    try:
        logger.info(f"Fetching prescriptions for user: {user_email}")
        
        # Query MongoDB for prescriptions matching the user_email
        prescriptions = list(collection.find(
            {"user_email": user_email},
            {"_id": 0}  # Exclude MongoDB's _id field from results
        ))
        
        if not prescriptions:
            return JSONResponse(
                status_code=404,
                content={"message": "No prescriptions found for this user"}
            )
        
        # Convert datetime to string before sending as response
        for prescription in prescriptions:
            prescription["timestamp"] = prescription["timestamp"].strftime("%Y-%m-%d %H:%M:%S")
        
        return JSONResponse(
            status_code=200,
            content={
                "count": len(prescriptions),
                "prescriptions": prescriptions
            }
        )
        
    except Exception as e:
        logger.error(f"Error fetching prescriptions: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching prescriptions: {str(e)}"
        )
    
@app.get("/view-image/{image_id}/{image_type}")
async def view_image(image_id: str, image_type: str):
    """Endpoint to view processed or original image"""
    if image_type not in ["original", "processed"]:
        raise HTTPException(status_code=400, detail="Invalid image type")
    
    if image_id not in PROCESSED_IMAGES:
        raise HTTPException(status_code=404, detail="Image ID not found")
    
    image_path = PROCESSED_IMAGES[image_id].get(image_type)
    if not image_path or not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image file not found")
    
    return FileResponse(image_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
