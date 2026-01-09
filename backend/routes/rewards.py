from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Reward
from sqlalchemy import func

rewards_bp = Blueprint('rewards', __name__)

@rewards_bp.route('/my-points', methods=['GET'])
@jwt_required()
def get_my_points():
    """Get user's total points and reward history"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or not user.school_id:
            return jsonify({'error': 'You must be in a school'}), 400
        
        # Get total points
        total_points = db.session.query(func.sum(Reward.points)).filter_by(
            user_id=user_id,
            school_id=user.school_id
        ).scalar() or 0
        
        # Get recent rewards
        rewards = Reward.query.filter_by(
            user_id=user_id,
            school_id=user.school_id
        ).order_by(Reward.created_at.desc()).limit(20).all()
        
        return jsonify({
            'total_points': int(total_points),
            'rewards': [reward.to_dict() for reward in rewards]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rewards_bp.route('/leaderboard', methods=['GET'])
@jwt_required()
def get_leaderboard():
    """Get school leaderboard"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or not user.school_id:
            return jsonify({'error': 'You must be in a school'}), 400
        
        # Get top users by points
        top_users = db.session.query(
            User.id,
            User.first_name,
            User.last_name,
            func.sum(Reward.points).label('total_points')
        ).join(
            Reward, User.id == Reward.user_id
        ).filter(
            Reward.school_id == user.school_id
        ).group_by(
            User.id, User.first_name, User.last_name
        ).order_by(
            func.sum(Reward.points).desc()
        ).limit(10).all()
        
        leaderboard = []
        for rank, (uid, first, last, points) in enumerate(top_users, 1):
            leaderboard.append({
                'rank': rank,
                'user_id': uid,
                'name': f"{first} {last}",
                'points': int(points) if points else 0
            })
        
        return jsonify({
            'leaderboard': leaderboard
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
