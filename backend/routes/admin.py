from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, School

admin_bp = Blueprint('admin', __name__)

def require_admin():
    """Helper function to check if user is admin"""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user or user.role != 'admin':
        return None
    return user

@admin_bp.route('/create-school', methods=['POST'])
@jwt_required()
def create_school():
    """Create a new school organization (admin only)"""
    try:
        admin = require_admin()
        if not admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        if not data or 'name' not in data:
            return jsonify({'error': 'School name is required'}), 400
        
        school_name = data['name'].strip()
        if not school_name:
            return jsonify({'error': 'School name cannot be empty'}), 400
        
        # Generate unique join code
        join_code = School.generate_join_code()
        
        # Create school
        school = School(
            name=school_name,
            join_code=join_code,
            created_by=admin.id
        )
        
        db.session.add(school)
        db.session.commit()
        
        return jsonify({
            'message': 'School created successfully',
            'school': school.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/schools', methods=['GET'])
@jwt_required()
def get_schools():
    """Get all schools (admin only)"""
    try:
        admin = require_admin()
        if not admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        schools = School.query.filter_by(is_active=True).all()
        return jsonify({
            'schools': [school.to_dict() for school in schools]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/school/<int:school_id>', methods=['GET'])
@jwt_required()
def get_school(school_id):
    """Get specific school details (admin only)"""
    try:
        admin = require_admin()
        if not admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        school = School.query.get_or_404(school_id)
        return jsonify({'school': school.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/school/<int:school_id>', methods=['DELETE'])
@jwt_required()
def delete_school(school_id):
    """Deactivate a school (admin only)"""
    try:
        admin = require_admin()
        if not admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        school = School.query.get_or_404(school_id)
        school.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'School deactivated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/regenerate-join-code/<int:school_id>', methods=['POST'])
@jwt_required()
def regenerate_join_code(school_id):
    """Regenerate join code for a school (admin only)"""
    try:
        admin = require_admin()
        if not admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        school = School.query.get_or_404(school_id)
        school.join_code = School.generate_join_code()
        db.session.commit()
        
        return jsonify({
            'message': 'Join code regenerated',
            'join_code': school.join_code
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

