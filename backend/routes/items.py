from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, LostItem, FoundItem, Match, Claim, QRCode, Reward
from datetime import datetime
import os
from werkzeug.utils import secure_filename
from services.gemini_service import analyze_item_for_matching, extract_item_details_from_photo
import json

items_bp = Blueprint('items', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file, folder='items'):
    """Save uploaded file and return URL"""
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{filename}"
        upload_path = os.path.join('instance', folder)
        os.makedirs(upload_path, exist_ok=True)
        filepath = os.path.join(upload_path, filename)
        file.save(filepath)
        return f"/uploads/{folder}/{filename}"
    return None

@items_bp.route('/lost', methods=['POST'])
@jwt_required()
def report_lost_item():
    """Report a lost item"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or not user.school_id:
            return jsonify({'error': 'You must be in a school to report items'}), 400
        
        data = request.form
        photo = request.files.get('photo')
        
        # Extract item details from photo if provided
        item_details = {}
        if photo:
            photo_bytes = photo.read()
            photo.seek(0)  # Reset for saving
            details = extract_item_details_from_photo(photo_bytes)
            item_details = details
        
        # Save photo
        photo_url = None
        if photo:
            photo_url = save_uploaded_file(photo, 'lost')
        
        # Create lost item
        lost_item = LostItem(
            user_id=user_id,
            school_id=user.school_id,
            title=data.get('title', item_details.get('description', 'Untitled Item')),
            description=data.get('description', item_details.get('description', '')),
            category=data.get('category', item_details.get('category', 'other')),
            color=data.get('color', item_details.get('color', '')),
            brand=data.get('brand', item_details.get('brand', '')),
            location=data.get('location', ''),
            location_lat=float(data.get('location_lat')) if data.get('location_lat') else None,
            location_lng=float(data.get('location_lng')) if data.get('location_lng') else None,
            lost_date=datetime.fromisoformat(data.get('lost_date')) if data.get('lost_date') else datetime.utcnow(),
            photo_url=photo_url,
            verification_question=data.get('verification_question', ''),
            verification_answer=data.get('verification_answer', ''),
            unique_traits=data.get('unique_traits', item_details.get('unique_features', []))
        )
        
        db.session.add(lost_item)
        db.session.commit()
        
        # Trigger matching
        try:
            found_items = FoundItem.query.filter_by(
                school_id=user.school_id,
                status='available'
            ).all()
            
            if found_items:
                found_items_dict = [item.to_dict() for item in found_items]
                print(f"🔍 Matching lost item '{lost_item.title}' against {len(found_items)} found items")
                matches = analyze_item_for_matching(lost_item.to_dict(), found_items_dict)
                print(f"📊 Found {len(matches)} potential matches")
                
                # Create match records
                matches_created = 0
                for match_data in matches:
                    match_score = match_data.get('match_score', 0)
                    if match_score >= 30:  # Lower threshold to 30% to catch more matches
                        found_item_idx = match_data.get('found_item_index')
                        if found_item_idx is not None and found_item_idx < len(found_items):
                            found_item = found_items[found_item_idx]
                            match = Match(
                                lost_item_id=lost_item.id,
                                found_item_id=found_item.id,
                                confidence_score=match_score,
                                match_reasons=json.dumps(match_data.get('match_reasons', []))
                            )
                            db.session.add(match)
                            matches_created += 1
                            print(f"✅ Created match: {match_score}% confidence")
                
                if matches_created > 0:
                    db.session.commit()
                    print(f"✅ Saved {matches_created} matches to database")
                else:
                    print(f"⚠️  No matches met the 50% confidence threshold")
        except Exception as e:
            print(f"❌ Error in matching: {str(e)}")
            import traceback
            traceback.print_exc()
            # Don't fail the request if matching fails
        
        # Award points for reporting
        reward = Reward(
            user_id=user_id,
            school_id=user.school_id,
            points=10,
            reason='Reported lost item',
            related_item_id=lost_item.id,
            related_type='lost'
        )
        db.session.add(reward)
        db.session.commit()
        
        return jsonify({
            'message': 'Lost item reported successfully',
            'item': lost_item.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@items_bp.route('/found', methods=['POST'])
@jwt_required()
def report_found_item():
    """Report a found item"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or not user.school_id:
            return jsonify({'error': 'You must be in a school to report items'}), 400
        
        data = request.form
        photo = request.files.get('photo')
        
        # Extract item details from photo if provided
        item_details = {}
        if photo:
            photo_bytes = photo.read()
            photo.seek(0)
            details = extract_item_details_from_photo(photo_bytes)
            item_details = details
        
        # Save photo
        photo_url = None
        if photo:
            photo_url = save_uploaded_file(photo, 'found')
        
        # Create found item
        found_item = FoundItem(
            user_id=user_id,
            school_id=user.school_id,
            title=data.get('title', item_details.get('description', 'Untitled Item')),
            description=data.get('description', item_details.get('description', '')),
            category=data.get('category', item_details.get('category', 'other')),
            color=data.get('color', item_details.get('color', '')),
            brand=data.get('brand', item_details.get('brand', '')),
            location=data.get('location', ''),
            location_lat=float(data.get('location_lat')) if data.get('location_lat') else None,
            location_lng=float(data.get('location_lng')) if data.get('location_lng') else None,
            photo_url=photo_url,
            status='available'  # Explicitly set status
        )
        
        db.session.add(found_item)
        db.session.commit()
        
        # Trigger AI matching with existing lost items
        try:
            lost_items = LostItem.query.filter_by(
                school_id=user.school_id,
                status='active'
            ).all()
            
            if lost_items:
                found_item_dict = found_item.to_dict()
                print(f"🔍 Matching found item '{found_item.title}' against {len(lost_items)} lost items")
                matches_created = 0
                for lost_item in lost_items:
                    matches = analyze_item_for_matching(
                        lost_item.to_dict(),
                        [found_item_dict]
                    )
                    
                    if matches and len(matches) > 0:
                        match_score = matches[0].get('match_score', 0)
                        if match_score >= 30:  # Lower threshold to 30% to catch more matches
                            match = Match(
                                lost_item_id=lost_item.id,
                                found_item_id=found_item.id,
                                confidence_score=match_score,
                                match_reasons=json.dumps(matches[0].get('match_reasons', []))
                            )
                            db.session.add(match)
                            matches_created += 1
                            print(f"✅ Created match: {match_score}% confidence for '{lost_item.title}'")
                
                if matches_created > 0:
                    db.session.commit()
                    print(f"✅ Saved {matches_created} matches to database")
                else:
                    print(f"⚠️  No matches met the 30% confidence threshold")
        except Exception as e:
            print(f"❌ Error in AI matching: {str(e)}")
            import traceback
            traceback.print_exc()
        
        # Award points
        reward = Reward(
            user_id=user_id,
            school_id=user.school_id,
            points=15,
            reason='Reported found item',
            related_item_id=found_item.id,
            related_type='found'
        )
        db.session.add(reward)
        db.session.commit()
        
        return jsonify({
            'message': 'Found item reported successfully',
            'item': found_item.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@items_bp.route('/lost', methods=['GET'])
@jwt_required()
def get_lost_items():
    """Get lost items for user's school"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or not user.school_id:
            return jsonify({'error': 'You must be in a school'}), 400
        
        items = LostItem.query.filter_by(school_id=user.school_id).order_by(LostItem.created_at.desc()).all()
        return jsonify({
            'items': [item.to_dict() for item in items]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@items_bp.route('/lost/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_lost_item(item_id):
    """Delete a lost item (only by owner)"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        lost_item = LostItem.query.get(item_id)
        if not lost_item:
            return jsonify({'error': 'Lost item not found'}), 404
        
        # Check if user owns this item
        if lost_item.user_id != user_id:
            return jsonify({'error': 'You can only delete your own lost items'}), 403
        
        # Delete associated matches
        Match.query.filter_by(lost_item_id=item_id).delete()
        
        # Delete associated claims
        Claim.query.filter_by(lost_item_id=item_id).delete()
        
        # Delete the item
        db.session.delete(lost_item)
        db.session.commit()
        
        return jsonify({'message': 'Lost item deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@items_bp.route('/found', methods=['GET'])
@jwt_required()
def get_found_items():
    """Get found items for user's school"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or not user.school_id:
            return jsonify({'error': 'You must be in a school'}), 400
        
        items = FoundItem.query.filter_by(school_id=user.school_id).order_by(FoundItem.created_at.desc()).all()
        return jsonify({
            'items': [item.to_dict() for item in items]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@items_bp.route('/matches', methods=['GET'])
@jwt_required()
def get_matches():
    """Get AI matches for user"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or not user.school_id:
            return jsonify({'error': 'You must be in a school'}), 400
        
        # Get matches for user's lost items
        lost_items = LostItem.query.filter_by(user_id=user_id).all()
        lost_item_ids = [item.id for item in lost_items]
        
        matches = Match.query.filter(
            Match.lost_item_id.in_(lost_item_ids),
            Match.status.in_(['pending', 'viewed'])
        ).order_by(Match.confidence_score.desc()).all()
        
        return jsonify({
            'matches': [match.to_dict() for match in matches]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@items_bp.route('/qr/<code>', methods=['GET'])
def get_qr_item(code):
    """Get found item by QR code (public endpoint)"""
    try:
        qr = QRCode.query.filter_by(code=code).first()
        if not qr:
            return jsonify({'error': 'Invalid QR code'}), 404
        
        found_item = FoundItem.query.get(qr.found_item_id)
        if not found_item or found_item.status != 'available':
            return jsonify({'error': 'Item not available'}), 404
        
        return jsonify({
            'item': found_item.to_dict(),
            'qr_code': qr.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
