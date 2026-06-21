# MarkItDown Backend API Service

This is the Python Flask backend service running Microsoft's **MarkItDown** converter, structured to run as a standalone web service on Render.com.

## How to Run Locally

1. **Navigate to this directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv .venv
   ```

3. **Activate the virtual environment:**
   - **Windows (PowerShell):** `.venv\Scripts\Activate.ps1`
   - **Windows (CMD):** `.venv\Scripts\activate.bat`
   - **macOS/Linux:** `source .venv/bin/activate`

4. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Start the Flask server:**
   ```bash
   python app.py
   ```
   The local server will run on `http://127.0.0.1:5000`. The frontend will automatically connect to it during local development.

---

## How to Deploy on Render.com

Since the backend folder is part of your main portfolio repository, you can deploy it as a **monorepo subfolder** without needing a separate GitHub repository:

1. **Push your latest commits** containing this `backend` folder to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: Add backend python scripts for MarkItDown"
   git push origin main
   ```

2. **Log in to [Render.com](https://render.com)** and create a new **Web Service**.

3. **Select your portfolio repository** (`Shourov-paul.github.io`).

4. **Configure the deployment settings:**
   - **Name:** `markitdown-backend` (or any name you prefer)
   - **Runtime:** `Python`
   - **Root Directory:** `backend` 👈 *Important! This tells Render to run only the code in this folder.*
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`

5. **Deploy the service.** 

6. **Update the frontend endpoint URL:**
   - Render will generate a live URL for your backend (e.g., `https://markitdown-backend.onrender.com`).
   - Go to your portfolio page settings on Render (or update it locally in `.env.local` for production testing) and define the environment variable:
     ```env
     NEXT_PUBLIC_MARKITDOWN_API_URL=https://<your-new-render-app-url>/convert
     ```
