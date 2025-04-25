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
from datetime import datetime
import logging
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

load_dotenv()

print("ENV DATABASE_URL:", os.getenv("DATABASE_URL"))

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# PostgreSQL Configuration
def get_db_connection():
    try:
        conn = psycopg2.connect(
            os.getenv("DATABASE_URL"),
            cursor_factory=RealDictCursor
        )
        logger.info("Successfully connected to PostgreSQL")
        return conn
    except Exception as e:
        logger.error(f"Could not connect to PostgreSQL: {e}")
        raise RuntimeError("Database connection failed")

# Initialize database table
def init_db():
    conn = None  # <-- Ensure conn is always defined
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS prescriptions (
                id SERIAL PRIMARY KEY,
                user_email TEXT,
                original_text TEXT,
                processed_text TEXT,
                cleaned_text TEXT,
                image_id TEXT,
                message TEXT,
                timestamp TIMESTAMP,
                filename TEXT
            )
        """)
        conn.commit()
        logger.info("Database table initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
    finally:
        if conn:
            conn.close()

# Initialize the database on startup
init_db()

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

            # Prepare data for PostgreSQL
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

            # Save to PostgreSQL
            logger.info("Saving to PostgreSQL...")
            conn = get_db_connection()
            cur = conn.cursor()
            
            cur.execute("""
                INSERT INTO prescriptions (
                    user_email, original_text, processed_text, 
                    cleaned_text, image_id, message, timestamp, filename
                ) VALUES (
                    %(user_email)s, %(original_text)s, %(processed_text)s,
                    %(cleaned_text)s, %(image_id)s, %(message)s, %(timestamp)s, %(filename)s
                )
            """, data)
            
            conn.commit()
            logger.info("Successfully saved to PostgreSQL")
            
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
    finally:
        if 'conn' in locals():
            conn.close()

@app.get("/user-prescriptions")
async def get_user_prescriptions(user_email: str):
    """Endpoint to get all prescriptions for a specific user"""
    try:
        logger.info(f"Fetching prescriptions for user: {user_email}")
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT 
                id, user_email, original_text, processed_text,
                cleaned_text, image_id, message, 
                to_char(timestamp, 'YYYY-MM-DD HH24:MI:SS') as timestamp,
                filename
            FROM prescriptions 
            WHERE user_email = %s
            ORDER BY timestamp DESC
        """, (user_email,))
        
        prescriptions = cur.fetchall()
        
        if not prescriptions:
            return JSONResponse(
                status_code=404,
                content={"message": "No prescriptions found for this user"}
            )
        
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
    finally:
        if 'conn' in locals():
            conn.close()
    
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