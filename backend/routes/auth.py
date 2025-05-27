from flask import Blueprint, request, redirect, session
from models import db, User
from flask_login import login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__, url_prefix="/auth")

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    user = User(username=data['username'], password=generate_password_hash(data['password']))
    db.session.add(user)
    db.session.commit()
    return {"message": "회원가입 성공"}

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        login_user(user)
        return {"message": "로그인 성공"}
    return {"error": "아이디나 비밀번호가 틀렸습니다"}, 401

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return {"message": "로그아웃 성공"}
