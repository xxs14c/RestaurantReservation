from flask import Blueprint, request, jsonify, session
from models import db, User
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__, url_prefix="/auth")

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "입력값이 부족합니다."}), 400
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "이미 존재하는 사용자입니다."}), 400

    user = User(
        username=data['username'],
        password=generate_password_hash(data['password'])
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "회원가입 성공"})

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "입력값이 부족합니다."}), 400
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        login_user(user)
        session['user_id'] = user.id  # 세션 쿠키 보장
        return jsonify({"message": "로그인 성공", "user": {"id": user.id, "username": user.username}})
    return jsonify({"error": "아이디나 비밀번호가 틀렸습니다"}), 401

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"message": "로그아웃 성공"})

@auth_bp.route('/me')
@login_required
def get_current_user():
    return jsonify({"user": {"id": current_user.id, "username": current_user.username}})
