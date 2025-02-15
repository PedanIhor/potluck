from sqlalchemy.orm.session import Session

from app.db.schemas import ParticipationBase
from app.db.models import Participation


def get_participations_for_party(db: Session, party_id: int):
    participations = db.query(Participation).filter(Participation.food_party_id == party_id).all()
    return participations


def create_participation(db: Session, participation: ParticipationBase):
    participation_model = Participation(**participation.model_dump())
    db.add(participation_model)
    db.commit()
    db.refresh(participation_model)
    return participation_model
