from sqlalchemy.orm.session import Session

from app.db.schemas import DishBase
from app.db.models import Dish

def get_all_dishes(db: Session):
    return db.query(Dish).all()


def create_dish(db: Session, dish: DishBase):
    dish_model = Dish(**dish.model_dump())
    db.add(dish_model)
    db.commit()
    db.refresh(dish_model)
    return dish_model
