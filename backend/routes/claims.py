from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, LostItem, FoundItem, Match, Claim, Message, Reward
from datetime import datetime
from services.gemini_service import verify_claim_with_photo
import os

claims_bp = Blueprint('claims', __name__)

@claims_bp.route('/create', methods=['POST'])
@jwt_required()
def create_claim():
    """Create a claim for a found item"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        lost_item_id = data.get('lost_item_id')
        found_item_id = data.get('found_item_id')
        verification_answer = data.get('verification_answer', '')
        
        if not lost_item_id or not found_item_id:
            return jsonify({'error': 'Missing required fields: lost_item_id and found_item_id'}), 400
        
        try:
            lost_item_id = int(lost_item_id)
            found_item_id = int(found_item_id)
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid item IDs'}), 400
        
        lost_item = LostItem.query.get(lost_item_id)
        found_item = FoundItem.query.get(found_item_id)
        
        if not lost_item:
            return jsonify({'error': 'Lost item not found'}), 404
        
        if not found_item:
            return jsonify({'error': 'Found item not found'}), 404
        
        if lost_item.user_id != user_id:
            return jsonify({'error': 'You can only claim items that match your own lost items'}), 403
        
        if found_item.status != 'available':
            return jsonify({'error': 'Item is no longer available'}), 400
        
        # Check if claim already exists
        existing_claim = Claim.query.filter_by(
            lost_item_id=lost_item_id,
            found_item_id=found_item_id,
            claimant_id=user_id
        ).first()
        
        if existing_claim:
            return jsonify({'error': 'You have already claimed this item'}), 400
        
        # Create claim
        claim = Claim(
            lost_item_id=lost_item_id,
            found_item_id=found_item_id,
            claimant_id=user_id,
            verification_answer=verification_answer
        )
        
        db.session.add(claim)
        
        # Update match status
        match = Match.query.filter_by(
            lost_item_id=lost_item_id,
            found_item_id=found_item_id
        ).first()
        if match:
            match.status = 'claimed'
        
        db.session.commit()
        
        return jsonify({
            'message': 'Claim created successfully',
            'claim': claim.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating claim: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@claims_bp.route('/verify', methods=['POST'])
@jwt_required()
def verify_claim():
    """Verify a claim with photo proof"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        claim_id = request.form.get('claim_id')
        proof_photo = request.files.get('proof_photo')
        
        claim = Claim.query.get(claim_id)
        if not claim:
            return jsonify({'error': 'Claim not found'}), 404
        
        if claim.claimant_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Verify with Gemini if photo provided
        verification_result = None
        proof_photo_url = None
        
        if proof_photo:
            # Save photo
            from werkzeug.utils import secure_filename
            filename = secure_filename(proof_photo.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"{timestamp}_{filename}"
            upload_path = os.path.join('instance', 'proofs')
            os.makedirs(upload_path, exist_ok=True)
            filepath = os.path.join(upload_path, filename)
            proof_photo.save(filepath)
            proof_photo_url = f"/uploads/proofs/{filename}"
            
            # Analyze with Gemini
            proof_photo.seek(0)
            photo_bytes = proof_photo.read()
            lost_item = LostItem.query.get(claim.lost_item_id)
            
            verification_result = verify_claim_with_photo(
                photo_bytes,
                lost_item.description or '',
                lost_item.verification_question
            )
        
        # Update claim
        claim.proof_photo_url = proof_photo_url
        if verification_result:
            if verification_result.get('verification_confidence', 0) >= 70:
                claim.verification_status = 'verified'
            else:
                claim.verification_status = 'pending'
        
        db.session.commit()
        
        return jsonify({
            'message': 'Claim verification submitted',
            'claim': claim.to_dict(),
            'verification': verification_result
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@claims_bp.route('/approve/<int:claim_id>', methods=['POST'])
@jwt_required()
def approve_claim(claim_id):
    """Approve a claim (admin or finder)"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        claim = Claim.query.get(claim_id)
        if not claim:
            return jsonify({'error': 'Claim not found'}), 404
        
        # Check permissions
        found_item = FoundItem.query.get(claim.found_item_id)
        if not found_item:
            return jsonify({'error': 'Found item not found'}), 404
        
        lost_item = LostItem.query.get(claim.lost_item_id)
        if not lost_item:
            return jsonify({'error': 'Lost item not found'}), 404
        
        is_finder = found_item.user_id == user_id
        is_admin = user.role == 'admin'
        
        if not (is_finder or is_admin):
            return jsonify({'error': 'Unauthorized - only the finder or admin can approve claims'}), 403
        
        # Check if already approved
        if claim.status == 'approved':
            return jsonify({'error': 'Claim is already approved'}), 400
        
        # Approve claim
        claim.status = 'approved'
        claim.verification_status = 'verified'  # Also update verification status
        claim.verified_by = user_id if is_admin else None
        claim.verified_at = datetime.utcnow()
        
        # Update item statuses
        found_item.status = 'claimed'
        lost_item.status = 'found'
        
        # Award points to finder
        finder_reward = Reward(
            user_id=found_item.user_id,
            school_id=found_item.school_id,
            points=50,
            reason='Returned lost item',
            related_item_id=found_item.id,
            related_type='found'
        )
        db.session.add(finder_reward)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Claim approved successfully',
            'claim': claim.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error approving claim: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@claims_bp.route('/my-claims', methods=['GET'])
@jwt_required()
def get_my_claims():
    """Get user's claims (as claimant)"""
    try:
        user_id = int(get_jwt_identity())
        
        claims = Claim.query.filter_by(claimant_id=user_id).order_by(Claim.created_at.desc()).all()
        
        return jsonify({
            'claims': [claim.to_dict() for claim in claims]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@claims_bp.route('/found-item-claims', methods=['GET'])
@jwt_required()
def get_found_item_claims():
    """Get claims on items found by the user"""
    try:
        user_id = int(get_jwt_identity())
        
        # Get all found items by this user
        found_items = FoundItem.query.filter_by(user_id=user_id).all()
        found_item_ids = [item.id for item in found_items]
        
        # Get all claims for these found items
        claims = Claim.query.filter(Claim.found_item_id.in_(found_item_ids)).order_by(Claim.created_at.desc()).all()
        
        return jsonify({
            'claims': [claim.to_dict() for claim in claims]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
