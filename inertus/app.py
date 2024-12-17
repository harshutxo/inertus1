from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config
from datetime import datetime
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
socketio = SocketIO(app)

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'}

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)
    type = db.Column(db.String(50))  # message, group_invite, etc.

CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'want to die', 'end it all',
    'self-harm', 'hurt myself', 'emergency', 'crisis'
]

CRISIS_RESPONSE = {
    'message': '''I notice you're expressing thoughts of harm. Please know that help is available:
    
    - Emergency: Call 911 (US)
    - National Crisis Line: 988
    - Crisis Text Line: Text HOME to 741741
    
    Would you like me to provide more specific resources for your situation?''',
    'resources': True
}

def check_crisis_keywords(message):
    return any(keyword in message.lower() for keyword in CRISIS_KEYWORDS)

@app.route('/psychai/message', methods=['POST'])
@login_required
@handle_ai_errors
def psychai_message():
    content = request.json.get('message')
    
    # Check for crisis keywords
    if check_crisis_keywords(content):
        return jsonify({
            'success': True,
            'response': CRISIS_RESPONSE['message'],
            'is_crisis': True,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })

@app.route('/notifications')
@login_required
def notifications():
    notifications = Notification.query.filter_by(
        user_id=current_user.id
    ).order_by(Notification.created_at.desc()).all()
    return render_template('notifications.html', notifications=notifications)

def create_notification(user_id, content, type='general'):
    notification = Notification(
        user_id=user_id,
        content=content,
        type=type
    )
    db.session.add(notification)
    db.session.commit()
    socketio.emit('notification', {
        'content': content,
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }, room=f"user_{user_id}")