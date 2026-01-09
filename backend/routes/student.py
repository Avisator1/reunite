from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, School

student_bp = Blueprint('student', __name__)

@student_bp.route('/join-school', methods=['POST'])
@jwt_required()
def join_school():
    """Join a school using join code"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        if not data or 'join_code' not in data:
            return jsonify({'error': 'Join code is required'}), 400
        
        join_code = data['join_code'].strip().upper()
        
        # Find school by join code
        school = School.query.filter_by(join_code=join_code, is_active=True).first()
        
        if not school:
            return jsonify({'error': 'Invalid join code'}), 404
        
        # Check if user is already in a school
        if user.school_id:
            if user.school_id == school.id:
                return jsonify({'error': 'You are already a member of this school'}), 400
            else:
                return jsonify({'error': 'You are already a member of another school'}), 400
        
        # Join the school
        user.school_id = school.id
        db.session.commit()
        
        return jsonify({
            'message': 'Successfully joined school',
            'school': school.to_dict(),
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@student_bp.route('/my-school', methods=['GET'])
@jwt_required()
def get_my_school():
    """Get current user's school information"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if not user.school_id:
            return jsonify({'message': 'Not a member of any school', 'school': None}), 200
        
        school = School.query.get(user.school_id)
        if not school:
            return jsonify({'error': 'School not found'}), 404
        
        return jsonify({'school': school.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@student_bp.route('/leave-school', methods=['POST'])
@jwt_required()
def leave_school():
    """Leave current school"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if not user.school_id:
            return jsonify({'error': 'You are not a member of any school'}), 400
        
        user.school_id = None
        db.session.commit()
        
        return jsonify({'message': 'Successfully left school'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

