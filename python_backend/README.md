# Medical AI Assistant Backend

## Setup Instructions

### Windows Developer Mode Setup (Recommended)

To enable proper symlink support for the Hugging Face model cache:

1. Open Windows Settings
2. Go to "Privacy & security" > "For developers"
3. Turn on "Developer Mode"
4. Restart your computer

This will enable proper symlink support and improve model caching performance.

### Alternative Solution

If you cannot enable Developer Mode, the application will still work but with reduced caching efficiency. The warning about symlinks has been disabled in the code.

## Running the Application

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Start the server:
```bash
python run.py
```

The server will start on `http://localhost:8000`

## API Endpoints

- `POST /api/chat`: Send a message to the AI model
- `GET /health`: Check server health status

## Model Information

The application uses the Microsoft BioGPT-large model for medical text generation. The model is automatically downloaded and cached on first use. 