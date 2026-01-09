from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import secrets

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='student')  # 'admin', 'student'
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship to school organization (membership)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=True)
    school = db.relationship('School', foreign_keys=[school_id], backref=db.backref('members', lazy=True), lazy=True)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if password matches"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'school_id': self.school_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class School(db.Model):
    __tablename__ = 'schools'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    join_code = db.Column(db.String(10), unique=True, nullable=False, index=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Relationship to creator (admin who created the school)
    creator = db.relationship('User', foreign_keys=[created_by], lazy=True)
    
    @staticmethod
    def generate_join_code():
        """Generate a unique 6-character join code"""
        import string
        while True:
            # Generate a 6-character alphanumeric code
            code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))
            if not School.query.filter_by(join_code=code).first():
                return code
    
    def to_dict(self):
        """Convert school to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'join_code': self.join_code,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'member_count': len(self.members) if self.members else 0
        }

class LostItem(db.Model):
    __tablename__ = 'lost_items'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    
    # Item details
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), nullable=False)  # phone, wallet, bag, etc.
    color = db.Column(db.String(50), nullable=True)
    brand = db.Column(db.String(100), nullable=True)
    location = db.Column(db.String(200), nullable=True)  # Where it was lost
    location_lat = db.Column(db.Float, nullable=True)
    location_lng = db.Column(db.Float, nullable=True)
    lost_date = db.Column(db.DateTime, nullable=False)
    
    # Photos
    photo_url = db.Column(db.String(500), nullable=True)
    
    # Verification questions (for secure claims)
    verification_question = db.Column(db.String(500), nullable=True)
    verification_answer = db.Column(db.String(200), nullable=True)
    unique_traits = db.Column(db.Text, nullable=True)  # Serial numbers, unique marks, etc.
    
    # Status
    status = db.Column(db.String(20), default='active', nullable=False)  # active, found, closed
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = db.relationship('User', foreign_keys=[user_id], lazy=True)
    school = db.relationship('School', foreign_keys=[school_id], lazy=True)
    matches = db.relationship('Match', foreign_keys='Match.lost_item_id', backref='lost_item', lazy=True, cascade='all, delete-orphan')
    claims = db.relationship('Claim', foreign_keys='Claim.lost_item_id', backref='lost_item', lazy=True, cascade='all, delete-orphan')
    qr_codes = db.relationship('QRCode', foreign_keys='QRCode.lost_item_id', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'school_id': self.school_id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'color': self.color,
            'brand': self.brand,
            'location': self.location,
            'location_lat': self.location_lat,
            'location_lng': self.location_lng,
            'lost_date': self.lost_date.isoformat() if self.lost_date else None,
            'photo_url': self.photo_url,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'user_name': f"{self.user.first_name} {self.user.last_name}" if self.user else None
        }

class FoundItem(db.Model):
    __tablename__ = 'found_items'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    
    # Item details
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(50), nullable=True)
    brand = db.Column(db.String(100), nullable=True)
    location = db.Column(db.String(200), nullable=True)  # Where it was found
    location_lat = db.Column(db.Float, nullable=True)
    location_lng = db.Column(db.Float, nullable=True)
    found_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Photos
    photo_url = db.Column(db.String(500), nullable=True)
    
    # Status
    status = db.Column(db.String(20), default='available', nullable=False)  # available, claimed, returned
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = db.relationship('User', foreign_keys=[user_id], lazy=True)
    school = db.relationship('School', foreign_keys=[school_id], lazy=True)
    matches = db.relationship('Match', foreign_keys='Match.found_item_id', backref='found_item', lazy=True, cascade='all, delete-orphan')
    claims = db.relationship('Claim', foreign_keys='Claim.found_item_id', backref='found_item', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'school_id': self.school_id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'color': self.color,
            'brand': self.brand,
            'location': self.location,
            'location_lat': self.location_lat,
            'location_lng': self.location_lng,
            'found_date': self.found_date.isoformat() if self.found_date else None,
            'photo_url': self.photo_url,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'finder_name': f"{self.user.first_name} {self.user.last_name}" if self.user else None
        }

class Match(db.Model):
    __tablename__ = 'matches'
    
    id = db.Column(db.Integer, primary_key=True)
    lost_item_id = db.Column(db.Integer, db.ForeignKey('lost_items.id'), nullable=False)
    found_item_id = db.Column(db.Integer, db.ForeignKey('found_items.id'), nullable=False)
    
    # AI matching scores
    confidence_score = db.Column(db.Float, nullable=False)  # 0-100
    match_reasons = db.Column(db.Text, nullable=True)  # JSON string of why it matched
    
    # Status
    status = db.Column(db.String(20), default='pending', nullable=False)  # pending, viewed, dismissed, claimed
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'lost_item_id': self.lost_item_id,
            'found_item_id': self.found_item_id,
            'confidence_score': self.confidence_score,
            'match_reasons': self.match_reasons,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'lost_item': self.lost_item.to_dict() if self.lost_item else None,
            'found_item': self.found_item.to_dict() if self.found_item else None
        }

class Claim(db.Model):
    __tablename__ = 'claims'
    
    id = db.Column(db.Integer, primary_key=True)
    lost_item_id = db.Column(db.Integer, db.ForeignKey('lost_items.id'), nullable=False)
    found_item_id = db.Column(db.Integer, db.ForeignKey('found_items.id'), nullable=False)
    claimant_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Person claiming
    
    # Verification
    verification_answer = db.Column(db.String(200), nullable=True)
    proof_photo_url = db.Column(db.String(500), nullable=True)
    verification_status = db.Column(db.String(20), default='pending', nullable=False)  # pending, verified, rejected
    verified_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Admin who verified
    verified_at = db.Column(db.DateTime, nullable=True)
    
    # Status
    status = db.Column(db.String(20), default='pending', nullable=False)  # pending, approved, rejected, completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    claimant = db.relationship('User', foreign_keys=[claimant_id], lazy=True)
    verifier = db.relationship('User', foreign_keys=[verified_by], lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'lost_item_id': self.lost_item_id,
            'found_item_id': self.found_item_id,
            'claimant_id': self.claimant_id,
            'verification_answer': self.verification_answer,
            'proof_photo_url': self.proof_photo_url,
            'verification_status': self.verification_status,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'verified_at': self.verified_at.isoformat() if self.verified_at else None,
            'claimant_name': f"{self.claimant.first_name} {self.claimant.last_name}" if self.claimant else None,
            'lost_item': self.lost_item.to_dict() if self.lost_item else None,
            'found_item': self.found_item.to_dict() if self.found_item else None
        }

class QRCode(db.Model):
    __tablename__ = 'qr_codes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Owner of the QR code
    lost_item_id = db.Column(db.Integer, db.ForeignKey('lost_items.id'), nullable=True)  # Optional: link to lost item
    code = db.Column(db.String(100), unique=True, nullable=False, index=True)
    qr_image_url = db.Column(db.String(500), nullable=True)
    contact_info = db.Column(db.String(500), nullable=True)  # Optional contact info to display
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = db.relationship('User', foreign_keys=[user_id], lazy=True)
    lost_item = db.relationship('LostItem', foreign_keys=[lost_item_id], lazy=True, overlaps="qr_codes")
    
    @staticmethod
    def generate_code():
        """Generate a unique QR code"""
        import string
        while True:
            code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(12))
            if not QRCode.query.filter_by(code=code).first():
                return code
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'lost_item_id': self.lost_item_id,
            'code': self.code,
            'qr_image_url': self.qr_image_url,
            'contact_info': self.contact_info,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'lost_item': self.lost_item.to_dict() if self.lost_item else None
        }

class Message(db.Model):
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    claim_id = db.Column(db.Integer, db.ForeignKey('claims.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    content = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    claim = db.relationship('Claim', foreign_keys=[claim_id], lazy=True)
    sender = db.relationship('User', foreign_keys=[sender_id], lazy=True)
    receiver = db.relationship('User', foreign_keys=[receiver_id], lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'claim_id': self.claim_id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'content': self.content,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'sender_name': f"{self.sender.first_name} {self.sender.last_name}" if self.sender else None,
            'receiver_name': f"{self.receiver.first_name} {self.receiver.last_name}" if self.receiver else None,
            'sender_name': f"{self.sender.first_name} {self.sender.last_name}" if self.sender else None
        }

class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    qr_code_id = db.Column(db.Integer, db.ForeignKey('qr_codes.id'), nullable=False)
    finder_name = db.Column(db.String(100), nullable=False)
    finder_email = db.Column(db.String(120), nullable=True)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    qr_code = db.relationship('QRCode', foreign_keys=[qr_code_id], lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'qr_code_id': self.qr_code_id,
            'finder_name': self.finder_name,
            'finder_email': self.finder_email,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Reward(db.Model):
    __tablename__ = 'rewards'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    
    # Points
    points = db.Column(db.Integer, default=0, nullable=False)
    reason = db.Column(db.String(200), nullable=False)  # "Returned item", "Reported found item", etc.
    related_item_id = db.Column(db.Integer, nullable=True)  # ID of related lost/found item
    related_type = db.Column(db.String(20), nullable=True)  # 'lost' or 'found'
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = db.relationship('User', foreign_keys=[user_id], lazy=True)
    school = db.relationship('School', foreign_keys=[school_id], lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'points': self.points,
            'reason': self.reason,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
