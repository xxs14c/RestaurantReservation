from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS

# db 객체는 애플리케이션 팩토리 함수 안에서 초기화
db = SQLAlchemy()

login_manager = LoginManager()

# 애플리케이션 팩토리 함수
def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    
    app.config.update(
        SECRET_KEY='supersecret',
        SQLALCHEMY_DATABASE_URI='sqlite:///db.sqlite3',
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SESSION_COOKIE_SAMESITE="None",
        SESSION_COOKIE_SECURE=False,
        SESSION_COOKIE_HTTPONLY=True,
    )
    # db와 login_manager 초기화
    db.init_app(app)
    login_manager.init_app(app)

    # User 모델 등 초기화
    from models import User, Table

    # 로그인 매니저 설정
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # 테이블 초기화 함수
    def init_tables():
        with app.app_context():
            # 테이블이 하나도 없으면 기본 테이블을 추가
            if Table.query.count() == 0:
                print("🌟 테이블 초기화 중...")
                table_data = []
                for capacity in [2, 4, 6, 8]:
                    table_data.append(Table(location="창문", capacity=capacity))
                    table_data.append(Table(location="내부", capacity=capacity))
                    table_data.append(Table(location="방", capacity=capacity))

                db.session.add_all(table_data)
                db.session.commit()
                print("✅ 기본 테이블 12개 생성 완료!")

    # DB 생성 및 테이블 초기화
    with app.app_context():
        db.create_all()  # DB와 테이블 생성
        init_tables()    # 테이블 초기화
        

    # 블루프린트 등록
    from routes.auth import auth_bp
    from routes.reservation import reservation_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(reservation_bp)

    return app
