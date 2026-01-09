from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Claim, Message, LostItem, FoundItem
from datetime import datetime

messages_bp = Blueprint('messages', __name__)

@messages_bp.route('/send', methods=['POST'])
@jwt_required()
def send_message():
    """Send a message in a claim chat"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        claim_id = data.get('claim_id')
        content = data.get('content', '').strip()
        
        if not content:
            return jsonify({'error': 'Message content is required'}), 400
        
        claim = Claim.query.get(claim_id)
        if not claim:
            return jsonify({'error': 'Claim not found'}), 404
        
        # Determine receiver (opposite party)
        lost_item = LostItem.query.get(claim.lost_item_id)
        found_item = FoundItem.query.get(claim.found_item_id)
        
        if not lost_item or not found_item:
            return jsonify({'error': 'Related items not found'}), 404
        
        if user_id == claim.claimant_id:
            receiver_id = found_item.user_id
        elif user_id == found_item.user_id:
            receiver_id = claim.claimant_id
        else:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Create message
        message = Message(
            claim_id=claim_id,
            sender_id=user_id,
            receiver_id=receiver_id,
            content=content
        )
        
        db.session.add(message)
        db.session.commit()
        
        return jsonify({
            'message': 'Message sent successfully',
            'message_data': message.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@messages_bp.route('/claim/<int:claim_id>', methods=['GET'])
@jwt_required()
def get_messages(claim_id):
    """Get messages for a claim"""
    try:
        user_id = int(get_jwt_identity())
        
        claim = Claim.query.get(claim_id)
        if not claim:
            return jsonify({'error': 'Claim not found'}), 404
        
        # Check authorization
        lost_item = LostItem.query.get(claim.lost_item_id)
        found_item = FoundItem.query.get(claim.found_item_id)
        
        if not lost_item or not found_item:
            return jsonify({'error': 'Related items not found'}), 404
        
        if user_id not in [claim.claimant_id, found_item.user_id]:
            return jsonify({'error': 'Unauthorized'}), 403
        
        messages = Message.query.filter_by(claim_id=claim_id).order_by(Message.created_at.asc()).all()
        
        # Mark as read
        for msg in messages:
            if msg.receiver_id == user_id and not msg.is_read:
                msg.is_read = True
        
        db.session.commit()
        
        return jsonify({
            'messages': [msg.to_dict() for msg in messages]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
