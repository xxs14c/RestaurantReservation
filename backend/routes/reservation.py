from flask import Blueprint, request
from flask_login import login_required, current_user
from models import db, Table, Reservation
from datetime import datetime, timedelta
from flask import jsonify

reservation_bp = Blueprint('reservation', __name__, url_prefix="/reservation")

# 예약 가능한 테이블 조회 
@reservation_bp.route('/tables')
@login_required
def list_tables():
    time_slot = request.args.get('time_slot')  # 'lunch'나 'dinner' 타임
    target_date = request.args.get('date')  # 예약하려는 날짜

    # 날짜 파싱
    reservation_date = datetime.strptime(target_date, "%Y-%m-%d").date()

    # 예약된 테이블 IDs 조회
    reserved_tables = Reservation.query.filter_by(
        date=reservation_date,
        time_slot=time_slot
    ).with_entities(Reservation.table_id).all()

    reserved_ids = {t[0] for t in reserved_tables}

    # 예약되지 않은 테이블만 조회
    available_tables = Table.query.filter(~Table.id.in_(reserved_ids)).all()

    # 결과 반환
    tables_info = [{
        'id': table.id,
        'location': table.location,
        'capacity': table.capacity
    } for table in available_tables]

    return {"available_tables": tables_info}

# 예약 요청
@reservation_bp.route('/reserve', methods=['POST'])
@login_required
def reserve():
    data = request.json
    reservation_date = datetime.strptime(data['date'], "%Y-%m-%d").date()
    time_slot = data['time_slot']  # 예: 'lunch' 또는 'dinner'
    
    # 한 달 이내 예약만 가능
    if reservation_date > datetime.today().date() + timedelta(days=30):
        return {"error": "한 달 이내만 예약 가능합니다."}, 400

    # 해당 시간대에 예약된 테이블 확인
    existing_reservation = Reservation.query.filter_by(
        table_id=data['table_id'],
        date=reservation_date,
        time_slot=time_slot
    ).first()

    if existing_reservation:
        return {"error": "해당 날짜, 시간대에 이미 예약된 테이블입니다."}, 400

    # 예약 저장
    reservation = Reservation(
        user_id=current_user.id,
        table_id=data['table_id'],
        name=data['name'],
        phone=data['phone'],
        credit_card=data['credit_card'],
        guest_count=data['guest_count'],
        date=reservation_date,
        time_slot=time_slot
    )

    db.session.add(reservation)
    db.session.commit()
    return {"message": "예약 완료", "reservation_id": reservation.id}

# 나의 예약 목록 조회
@reservation_bp.route('/my_reservations')
@login_required
def my_reservations():
    reservations = Reservation.query.filter_by(user_id=current_user.id).all()
    result = [{
        "id": res.id,
        "table": res.table.location,
        "date": res.date.isoformat(),  # 날짜 객체는 isoformat으로 문자열 변환 필요
        "time_slot": res.time_slot,
        "guest_count": res.guest_count
    } for res in reservations]
    return jsonify(result)
    

# 예약 취소 
@reservation_bp.route('/cancel', methods=['POST'])
@login_required
def cancel_reservation():
    data = request.json
    reservation_id = data.get('reservation_id')
    
    reservation = Reservation.query.get_or_404(reservation_id)
    
    if reservation.user_id != current_user.id:
        return {"error": "자신의 예약만 취소할 수 있습니다."}, 403
    
    if reservation.date <= datetime.today().date():
        return {"error": "당일에는 예약을 취소할 수 없습니다."}, 400

    db.session.delete(reservation)
    db.session.commit()
    
    return {"message": "예약 취소 완료"}
