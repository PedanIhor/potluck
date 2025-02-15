from sqlalchemy.orm.session import Session

from datetime import datetime

from app.db.schemas import FoodPartyBase
from app.db.models import FoodParty


def get_all_further_parties(db: Session):
    query = db.query(FoodParty).filter(datetime.now() < FoodParty.date)
    return query.all()


def get_all_parties(db: Session):
    return db.query(FoodParty).all()


def create_food_party(db: Session, party: FoodPartyBase):
    party_model = FoodParty(**party.model_dump())
    db.add(party_model)
    db.commit()
    db.refresh(party_model)
    return party_model


def get_food_party(db: Session, id: int):
    return db.query(FoodParty).filter(FoodParty.id == id).first()