from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .model import ModelHandler
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model
model_handler = ModelHandler()

class Query(BaseModel):
    message: str

# Endpoint for Symptom Checker and general chat (uses local BioGPT)
@app.post("/api/query")
async def process_query(query: Query):
    try:
        logger.info(f"Received query: {query.message}")
        
        if not model_handler.is_model_ready():
            logger.error("Model is not ready")
            raise HTTPException(status_code=503, detail="Model is not ready yet")
        
        logger.info("Generating response...")
        response = model_handler.generate_response(query.message)
        logger.info(f"Generated response: {response[:100]}...")  # Log first 100 chars
        
        return {"response": response}
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    is_ready = model_handler.is_model_ready()
    logger.info(f"Health check - Model ready: {is_ready}")
    return {"status": "healthy", "model_ready": is_ready} 