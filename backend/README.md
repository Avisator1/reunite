# Reunite Backend API

Flask backend for the Reunite Lost & Found platform.

## Setup

1. **Install Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Run the Flask server:**
```bash
python app.py
```

The server will start on `https://reunite.adiavi.com/`

## Default Admin Account

When you first run the app, a default admin account is created:
- **Email:** admin@reunite.com
- **Password:** admin123

⚠️ **Change this in production!**

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Admin (`/api/admin`)
- `POST /api/admin/create-school` - Create school organization
- `GET /api/admin/schools` - Get all schools
- `GET /api/admin/school/<id>` - Get school details
- `DELETE /api/admin/school/<id>` - Deactivate school
- `POST /api/admin/regenerate-join-code/<id>` - Regenerate join code

### Student (`/api/student`)
- `POST /api/student/join-school` - Join school with join code
- `GET /api/student/my-school` - Get user's school
- `POST /api/student/leave-school` - Leave current school

## Database

The app uses SQLite by default (stored in `reunite.db`). To use PostgreSQL or MySQL, update the `DATABASE_URL` in `config.py` or set it as an environment variable.

## Environment Variables

Create a `.env` file (see `.env.example`):
- `SECRET_KEY` - Flask secret key
- `JWT_SECRET_KEY` - JWT signing key
- `DATABASE_URL` - Database connection string

