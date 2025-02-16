from sqlalchemy.orm.session import Session

from app.db.schemas import ParticipationBase
from app.db.models import Participation, Dish


def get_participation(db: Session, participation_id: int):
    participation = db.query(Participation).filter(Participation.id == participation_id).first()
    return participation


def get_participations_for_party(db: Session, party_id: int):
    participations = db.query(Participation).filter(Participation.food_party_id == party_id).all()
    return participations


def create_participation(db: Session, participation: ParticipationBase):
    dump = participation.model_dump()
    dishes_ids = dump.pop("dishes")
    dishes = db.query(Dish).filter(Dish.id.in_(dishes_ids)).all()
    participation_model = Participation(**dump)
    participation_model.dishes = dishes
    db.add(participation_model)
    db.commit()
    db.refresh(participation_model)
    return participation_model


def add_dishes_to_participation(db: Session, participation_id: int, dishes_ids: list[int]):
    participation = db.query(Participation).filter(Participation.id == participation_id).first()
    dishes = db.query(Dish).filter(Dish.id.in_(dishes_ids)).all()
    participation.dishes.extend(dishes)
    db.commit()
    db.refresh(participation)
    return participation
