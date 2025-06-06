import uvicorn
from app.main import app

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",  # Allow external connections
        port=8000,
        reload=True,  # Enable auto-reload during development
        workers=1  # Single worker for development
    ) 