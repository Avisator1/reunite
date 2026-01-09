# Reunite - Setup Guide

## Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create a virtual environment (recommended):**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run the Flask server:**
```bash
python app.py
```

The backend will run on `https://reunite.adiavi.com/`

## Frontend Setup

1. **Install dependencies (if not already done):**
```bash
npm install
```

2. **Run the development server:**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Default Admin Account

- **Email:** admin@reunite.com
- **Password:** admin123

⚠️ **Important:** Change this password in production!

## Testing the Setup

1. Start the backend server (port 5000)
2. Start the frontend server (port 5173)
3. Visit `http://localhost:5173`
4. Click "Sign Up" to create a student account
5. Or click "Sign In" and use the admin credentials above

## Admin Features

1. Login as admin
2. Go to Admin Dashboard
3. Create a school organization
4. Copy the join code
5. Use that join code when signing up as a student (or join later from dashboard)

## Student Features

1. Sign up with or without a join code
2. If you don't have a join code, you can join a school later from your dashboard
3. Once in a school, you'll be able to use all the lost & found features (coming soon)

