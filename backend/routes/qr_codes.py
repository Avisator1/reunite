from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, LostItem, QRCode, ContactMessage
from datetime import datetime
import qrcode
import io
import secrets
import string

qr_bp = Blueprint('qr_codes', __name__)

@qr_bp.route('/create', methods=['POST'])
@jwt_required()
def create_qr_code():
    """Create a QR code for a lost item (or general use)"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        lost_item_id = data.get('lost_item_id')  # Optional
        contact_info = data.get('contact_info', '')  # Optional contact info
        
        # Generate unique code
        code = QRCode.generate_code()
        
        # Create QR code
        qr_code = QRCode(
            user_id=user_id,
            lost_item_id=lost_item_id if lost_item_id else None,
            code=code,
            contact_info=contact_info
        )
        
        db.session.add(qr_code)
        db.session.commit()
        
        # Generate QR code image
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        # QR code links to frontend page
        # Use request.host_url and replace port 5000 with frontend port (5173 for Vite dev)
        # In production, use your actual frontend domain
        base_url = request.host_url.rstrip('/')
        # Replace backend port with frontend port for local dev
        if 'localhost:5000' in base_url:
            frontend_url = base_url.replace(':5000', ':5173')
        else:
            # In production, use your frontend domain
            frontend_url = base_url.replace(':5000', '')  # Or use your actual frontend URL
        qr_url = f"{frontend_url}/qr/{code}"
        qr.add_data(qr_url)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save QR code image
        from werkzeug.utils import secure_filename
        import os
        filename = f"{code}_qr.png"
        upload_path = os.path.join('instance', 'qr_codes')
        os.makedirs(upload_path, exist_ok=True)
        filepath = os.path.join(upload_path, filename)
        img.save(filepath)
        
        qr_code.qr_image_url = f"/uploads/qr_codes/{filename}"
        db.session.commit()
        
        return jsonify({
            'message': 'QR code created successfully',
            'qr_code': qr_code.to_dict(),
            'qr_url': qr_url
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating QR code: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@qr_bp.route('/my-codes', methods=['GET'])
@jwt_required()
def get_my_qr_codes():
    """Get user's QR codes"""
    try:
        user_id = int(get_jwt_identity())
        
        qr_codes = QRCode.query.filter_by(user_id=user_id).order_by(QRCode.created_at.desc()).all()
        
        return jsonify({
            'qr_codes': [qr.to_dict() for qr in qr_codes]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@qr_bp.route('/contact-messages', methods=['GET'])
@jwt_required()
def get_contact_messages():
    """Get contact messages for user's QR codes"""
    try:
        user_id = int(get_jwt_identity())
        
        # Get all QR codes owned by user
        qr_codes = QRCode.query.filter_by(user_id=user_id).all()
        qr_code_ids = [qr.id for qr in qr_codes]
        
        # Get all contact messages for these QR codes
        contact_messages = ContactMessage.query.filter(
            ContactMessage.qr_code_id.in_(qr_code_ids)
        ).order_by(ContactMessage.created_at.desc()).all()
        
        return jsonify({
            'messages': [msg.to_dict() for msg in contact_messages]
        }), 200
        
    except Exception as e:
        print(f"Error getting contact messages: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@qr_bp.route('/<code>', methods=['GET'])
def get_qr_info(code):
    """Public endpoint - Get info when QR code is scanned"""
    try:
        qr = QRCode.query.filter_by(code=code).first()
        if not qr:
            return jsonify({'error': 'Invalid QR code'}), 404
        
        user = User.query.get(qr.user_id)
        lost_item = LostItem.query.get(qr.lost_item_id) if qr.lost_item_id else None
        
        return jsonify({
            'code': qr.code,
            'owner_name': f"{user.first_name} {user.last_name}" if user else "Unknown",
            'contact_info': qr.contact_info,
            'lost_item': lost_item.to_dict() if lost_item else None,
            'message': 'This item belongs to someone. Please contact them to return it.'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@qr_bp.route('/<code>/contact', methods=['POST'])
def contact_qr_owner(code):
    """Public endpoint - Send a message to QR code owner"""
    try:
        data = request.get_json()
        finder_name = data.get('finder_name', 'Someone')
        finder_email = data.get('finder_email', '')
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        qr = QRCode.query.filter_by(code=code).first()
        if not qr:
            return jsonify({'error': 'Invalid QR code'}), 404
        
        # Create a contact message to notify the QR code owner
        contact_message = ContactMessage(
            qr_code_id=qr.id,
            finder_name=finder_name,
            finder_email=finder_email if finder_email else None,
            message=message,
            is_read=False
        )
        
        db.session.add(contact_message)
        db.session.commit()
        
        return jsonify({
            'message': 'Your message has been sent! The owner will be notified.',
            'success': True
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@qr_bp.route('/image/<code>', methods=['GET'])
def get_qr_image(code):
    """Get QR code image"""
    try:
        qr = QRCode.query.filter_by(code=code).first()
        if not qr or not qr.qr_image_url:
            return jsonify({'error': 'QR code image not found'}), 404
        
        from flask import send_from_directory
        import os
        filename = os.path.basename(qr.qr_image_url)
        return send_from_directory(os.path.join('instance', 'qr_codes'), filename)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@qr_bp.route('/<int:qr_id>', methods=['DELETE'])
@jwt_required()
def delete_qr_code(qr_id):
    """Delete a QR code (only by owner)"""
    try:
        user_id = int(get_jwt_identity())
        qr = QRCode.query.get(qr_id)
        
        if not qr:
            return jsonify({'error': 'QR code not found'}), 404
        
        if qr.user_id != user_id:
            return jsonify({'error': 'You can only delete your own QR codes'}), 403
        
        # Delete the QR code image file if it exists
        if qr.qr_image_url:
            try:
                import os
                filename = os.path.basename(qr.qr_image_url)
                filepath = os.path.join('instance', 'qr_codes', filename)
                if os.path.exists(filepath):
                    os.remove(filepath)
            except Exception as e:
                print(f"Warning: Could not delete QR image file: {e}")
        
        db.session.delete(qr)
        db.session.commit()
        
        return jsonify({
            'message': 'QR code deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting QR code: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
