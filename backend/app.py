from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True, origins=[
        "http://localhost:3000", "http://127.0.0.1:3000"
    ])
    app.config.update(
        SECRET_KEY="supersecret",
        SQLALCHEMY_DATABASE_URI="sqlite:///db.sqlite3",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SESSION_COOKIE_SAMESITE="Lax",
        SESSION_COOKIE_SECURE=False,
        SESSION_COOKIE_HTTPONLY=True
    )
    db.init_app(app)
    login_manager.init_app(app)

    from models import User, Table

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    from routes.auth import auth_bp
    from routes.reservation import reservation_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(reservation_bp)

    return app
