from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.student import student_bp
from routes.items import items_bp
from routes.claims import claims_bp
from routes.messages import messages_bp
from routes.rewards import rewards_bp
from routes.qr_codes import qr_bp
from routes.chat import chat_bp
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    CORS(app, 
         origins=["http://localhost:5173", "http://localhost:3000"], 
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    # JWT Error Handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired'}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        error_msg = str(error) if error else 'Invalid token'
        print(f"Invalid token error: {error_msg}")
        return jsonify({'error': f'Invalid token: {error_msg}'}), 422
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        error_msg = str(error) if error else 'Authorization token is missing'
        print(f"Unauthorized error: {error_msg}")
        return jsonify({'error': error_msg}), 401
    
    @jwt.needs_fresh_token_loader
    def token_not_fresh_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token is not fresh'}), 401
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(student_bp, url_prefix='/api/student')
    app.register_blueprint(items_bp, url_prefix='/api/items')
    app.register_blueprint(claims_bp, url_prefix='/api/claims')
    app.register_blueprint(messages_bp, url_prefix='/api/messages')
    app.register_blueprint(rewards_bp, url_prefix='/api/rewards')
    app.register_blueprint(qr_bp, url_prefix='/api/qr-codes')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    
    # Serve uploaded files
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        # Handle subdirectories like 'lost', 'found', 'qr_codes', 'proofs'
        # filename will be like 'lost/filename.jpg' or 'found/filename.jpg'
        parts = filename.split('/', 1)
        if len(parts) == 2:
            folder, file = parts
            return send_from_directory(os.path.join('instance', folder), file)
        else:
            # Fallback to uploads folder if no subdirectory
            return send_from_directory(os.path.join('instance', 'uploads'), filename)
    
    # Public QR code page
    @app.route('/qr/<code>')
    def qr_code_page(code):
        """Public page when QR code is scanned"""
        from flask import render_template_string, request
        base_url = request.host_url.rstrip('/')
        html_template = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Item Found - Reunite</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {{ font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }}
                .container {{ background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }}
                h1 {{ color: #2f303c; }}
                .form-group {{ margin-bottom: 16px; }}
                label {{ display: block; margin-bottom: 8px; font-weight: 600; color: #2f303c; }}
                input, textarea {{ width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; }}
                button {{ background: #4278ff; color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }}
                button:hover {{ background: #3a6ce0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📱 Item Found</h1>
                <p>This item belongs to someone. Please fill out the form below to contact the owner and help return their item.</p>
                <form id="contactForm">
                    <div class="form-group">
                        <label>Your Name *</label>
                        <input type="text" name="finder_name" required>
                    </div>
                    <div class="form-group">
                        <label>Your Email</label>
                        <input type="email" name="finder_email">
                    </div>
                    <div class="form-group">
                        <label>Message *</label>
                        <textarea name="message" rows="4" required placeholder="I found your item! How can I return it to you?"></textarea>
                    </div>
                    <button type="submit">Send Message</button>
                </form>
                <div id="result" style="margin-top: 20px; display: none;"></div>
            </div>
            <script>
                document.getElementById('contactForm').addEventListener('submit', async (e) => {{
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData);
                    try {{
                        const response = await fetch('{base_url}/api/qr-codes/{code}/contact', {{
                            method: 'POST',
                            headers: {{ 'Content-Type': 'application/json' }},
                            body: JSON.stringify(data)
                        }});
                        const result = await response.json();
                        document.getElementById('result').style.display = 'block';
                        document.getElementById('result').innerHTML = result.success 
                            ? '<p style="color: green;">✓ ' + result.message + '</p>'
                            : '<p style="color: red;">Error: ' + result.error + '</p>';
                        e.target.reset();
                    }} catch (err) {{
                        document.getElementById('result').style.display = 'block';
                        document.getElementById('result').innerHTML = '<p style="color: red;">Error sending message</p>';
                    }}
                }});
            </script>
        </body>
        </html>
        """
        return render_template_string(html_template)
    
    # Create tables
    with app.app_context():
        db.create_all()
        
        # Create default admin account if it doesn't exist
        from models import User
        admin = User.query.filter_by(email='admin@reunite.com').first()
        if not admin:
            admin = User(
                email='admin@reunite.com',
                first_name='Admin',
                last_name='User',
                role='admin'
            )
            admin.set_password('admin123')  # Change this in production!
            db.session.add(admin)
            db.session.commit()
            print("Default admin created: admin@reunite.com / admin123")
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)

