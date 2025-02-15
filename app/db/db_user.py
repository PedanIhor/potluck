from sqlalchemy.orm.session import Session

from app.db.models import User


def get_user_by_id(db: Session, id: int):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise Exception("User not found")
    return user