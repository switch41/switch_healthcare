# Switch Health care AI Companion

## Project Overview

Switch Health care AI Companion is a healthcare application with a multi-backend architecture and a modern frontend. It aims to provide AI-assisted healthcare services, including symptom checking and potentially other features like medical record management and patient-provider chat.

The project is composed of the following main parts:

1.  **Python Backend (FastAPI):** Handles AI model loading and inference for features like the Symptom Checker.
2.  **Node.js Backend (Express):** Provides the core RESTful API for user authentication, data management (e.g., medical records, chat history), and other application logic.
3.  **Frontend (React/TypeScript):** The user interface for interacting with the application and both backend services.

## Project Structure

```
med-assist-ai-companion/
├── src/
│   ├── frontend/                 # Frontend application (React/TypeScript)
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions and constants
│   │   ├── styles/             # Global styles and themes
│   │   └── types/              # TypeScript type definitions
│   │
│   ├── backend/                 # Node.js Backend application (Express)
│   │   ├── config/             # Configuration files
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Middleware (Security, Rate Limiting, etc.)
│   │   ├── models/             # Database models (Mongoose)
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── types/              # TypeScript type definitions
│   │   └── utils/              # Utility functions
│   │
│   └── shared/                  # Shared code between frontend and Node.js backend
│       ├── constants/          # Shared constants
│       ├── types/              # Shared TypeScript types
│       └── utils/              # Shared utility functions
│
├── python_backend/            # Python Backend application (FastAPI)
│   ├── app/                  # FastAPI application code
│   │   ├── api.py           # API endpoints (AI model interaction)
│   │   ├── model.py         # AI model loading and inference
│   │   └── ...              # Other app modules
│   ├── requirements.txt      # Python dependencies
│   └── run_api.py            # Script to run the FastAPI server
│
├── public/                      # Static files
├── tests/                       # Test files
│   ├── frontend/               # Frontend tests
│   └── backend/                # Backend tests
│
├── .env.example                 # Example environment variables file
├── package.json                 # Node.js dependencies and scripts
├── package-lock.json            # Node.js dependency lock file
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite frontend configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── eslint.config.js             # ESLint configuration
├── index.html                   # Frontend entry point
├── .gitignore                   # Git ignore file
└── ...                          # Other config files (husky, supabase, etc.)
```

## Technologies Used

### Python Backend (FastAPI)

*   **Framework:** FastAPI
*   **AI/ML:** Hugging Face Transformers, PyTorch
*   **Dependencies:** Managed with `requirements.txt`
*   **Key Files:** `python_backend/app/api.py`, `python_backend/app/model.py`, `python_backend/requirements.txt`

### Node.js Backend (Express)

*   **Framework:** Express.js
*   **Database:** MongoDB with Mongoose ODM
*   **Authentication:** JWT (JSON Web Tokens), Passport.js
*   **Logging:** Winston
*   **Security:** Helmet, Express Rate Limit
*   **Dependencies:** Managed with `package.json`
*   **Key Files:** `src/backend/server.ts`, `src/backend/routes/*`, `src/backend/models/*`

### Frontend (React/TypeScript)

*   **Framework:** React
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **State Management:** (Implicit - likely React hooks/Context API)
*   **Routing:** React Router DOM
*   **API Communication:** Fetch API, Axios
*   **Dependencies:** Managed with `package.json`
*   **Key Files:** `src/App.tsx`, `src/main.tsx`, `src/pages/*`, `src/components/*`, `src/hooks/*`, `src/services/*`

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/switch41/Switch_Health_care.git
    cd med-assist-ai-companion
    ```

2.  **Set up Environment Variables:**
    Create a `.env` file in the project root based on `.env.example`. You will need to configure variables for MongoDB connection, JWT secret, CORS origins, and potentially API keys for external services (like Gemini, if used).

    ```dotenv
    # Example .env file content (adjust as needed)
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/medassist
    JWT_SECRET=your_super_secure_jwt_secret
    CORS_ORIGIN=http://localhost:5173 # Or your frontend URL
    # Add any other necessary variables (e.g., for external APIs)
    ```

3.  **Install Python Backend Dependencies:**
    Navigate to the `python_backend` directory and install the required packages.

    ```bash
    cd python_backend
    pip install -r requirements.txt
    ```

4.  **Install Node.js Backend and Frontend Dependencies:**
    Navigate back to the project root directory and install Node.js dependencies.

    ```bash
    cd ..
    npm install
    ```

## Running the Application

To run the full application, you need to start the MongoDB database (if not already running), both backend services, and the frontend development server.

1.  **Start MongoDB:**
    Ensure your MongoDB server is running. Refer to MongoDB documentation for instructions.

2.  **Start the Python Backend (FastAPI):**
    Open a terminal, navigate to the `python_backend` directory, and run:

    ```bash
    cd python_backend
    python run_api.py
    ```

3.  **Start the Node.js Backend (Express):**
    Open a **new** terminal, navigate to the project root directory, and run:

    ```bash
    npm run dev:backend
    ```

4.  **Start the Frontend (React):**
    Open a **new** terminal, navigate to the project root directory, and run:

    ```bash
    npm run dev
    ```

The frontend should be accessible in your browser (typically at `http://localhost:5173` unless configured differently). The Node.js backend should be running on the port specified in your `.env` file (defaulting to 3000), and the Python backend on port 8001 (as configured in `run_api.py`).

## API Documentation (Node.js Backend)

The Node.js backend provides the main API endpoints. The base URL is typically `http://localhost:<PORT>/api`. The following endpoints are available:

### Authentication
#### Login
```http
POST /auth/login
```
Request body:
```json
{
  "email": "string",
  "password": "string"
}
```
Response:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### Register
```http
POST /auth/register
```
Request body:
```json
{
  "email": "string",
  "password": "string",
  "role": "string"
}
```

#### Logout
```http
POST /auth/logout
```

### Provider Endpoints
#### Get Provider Profile
```http
GET /providers/profile
```
Response:
```json
{
  "id": "string",
  "name": "string",
  "specialization": "string",
  "contact": {
    "email": "string",
    "phone": "string"
  }
}
```

#### Update Provider Profile
```http
PUT /providers/profile
```
Request body:
```json
{
  "name": "string",
  "specialization": "string",
  "contact": {
    "email": "string",
    "phone": "string"
  }
}
```

#### Get Provider's Patients
```http
GET /providers/patients
```
Response:
```json
{
  "patients": [
    {
      "id": "string",
      "name": "string",
      "lastVisit": "date",
      "status": "string"
    }
  ]
}
```

### Patient Endpoints
#### Get Patient Profile
```http
GET /patients/:id
```

#### Update Patient Profile
```http
PUT /patients/:id
```

#### Get Patient Medical Records
```http
GET /patients/:id/records
```

### Chat Endpoints (Node.js Backend)
#### Start New Chat
```http
POST /chat
```
Request body:
```json
{
  "patientId": "string",
  "message": "string"
}
```

#### Get Chat History
```http
GET /chat/:id
```

#### Send Message
```http
POST /chat/:id/messages
```
Request body:
```json
{
  "content": "string",
  "type": "string"
}
```

## AI Model Endpoint (Python Backend)

The Python backend provides the API for interacting with the AI model. The base URL is typically `http://localhost:8001/api`.

### Query AI Model
```http
POST /api/query
```
Request body:
```json
{
  "message": "string"
}
```
Response:
```json
{
  "response": "string"
}
```

### Model Health Check
```http
GET /api/health
```
Response:
```json
{
  "status": "healthy",
  "model_ready": "boolean"
}
```

## Error Handling

Both backends should ideally follow consistent error handling. Refer to the Node.js backend section for a general error response format. Specific errors may vary.

## Security Considerations

*   **Authentication:** JWT is used for authenticating users with the Node.js backend. Ensure JWT secrets are strong and stored securely.
*   **Authorization:** Implement proper authorization checks on backend endpoints.
*   **API Keys:** If using external APIs (like Gemini), store keys securely using environment variables, not directly in code (as noted previously during Gemini integration attempt).
*   **CORS:** Configured to allow requests from your frontend.
*   **Rate Limiting:** Implemented in the Node.js backend to protect against abuse.
*   **Input Validation:** Sanitize and validate all user inputs on the backend.
*   **Dependency Security:** Regularly update project dependencies to fix vulnerabilities.

## Contributing

(Section for contribution guidelines)

## License

(Section for license information)
