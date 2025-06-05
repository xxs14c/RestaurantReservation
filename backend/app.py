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
    CORS(app,
     supports_credentials=True,
     resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})
    
    app.config.update(
    SECRET_KEY='supersecret',
    SQLALCHEMY_DATABASE_URI='sqlite:///db.sqlite3',
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    SESSION_COOKIE_SAMESITE="Lax",
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
            # 테이블이 한 번도 생성되지 않았다면—최초 1회만 실행
            if Table.query.count() == 0:
                print("🌟 테이블 초기화 중...")

                table_data = []
                # 우리가 정의하고 싶은 위치들 (프론트 mockTables와 동일하게)
                locations = ["창가", "룸", "내부", "방"]
                # 우리가 지원하고 싶은 용량들
                capacities = [2, 4, 6, 8]

                # capacity마다 location 리스트를 순회하면서 Table 인스턴스를 생성
                for cap in capacities:
                    for loc in locations:
                        table_data.append(Table(location=loc, capacity=cap))
                    # → 이렇게 하면 capacity 2짜리 테이블 4개(창가/룸/내부/방),
                    #    capacity 4짜리 테이블 4개, 6짜리 테이블 4개, 8짜리 테이블 4개 총 16개가 생성됨

                db.session.add_all(table_data)
                db.session.commit()
                print("✅ 기본 테이블 16개(용량2,4,6,8 각 위치별) 생성 완료!")

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
