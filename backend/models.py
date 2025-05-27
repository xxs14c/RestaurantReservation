from app import db
from flask_login import UserMixin

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(200))

class Table(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(50))  
    capacity = db.Column(db.Integer)

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    table_id = db.Column(db.Integer, db.ForeignKey('table.id'))
    name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    credit_card = db.Column(db.String(20))
    guest_count = db.Column(db.Integer)
    date = db.Column(db.Date)
    time_slot = db.Column(db.String(10))
    
    user = db.relationship('User', backref='reservations')
    table = db.relationship('Table', backref='reservations')
