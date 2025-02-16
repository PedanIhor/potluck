from sqlalchemy.orm.session import Session

from app.db.schemas import DishBase, CuisineType
from app.db.models import Dish

def get_all_dishes(db: Session, cuisine: CuisineType = None):
    queryset = db.query(Dish)
    if cuisine:
        queryset = queryset.filter(Dish.cuisine == cuisine)
    return queryset.all()


def create_dish(db: Session, dish: DishBase):
    dish_model = Dish(**dish.model_dump())
    db.add(dish_model)
    db.commit()
    db.refresh(dish_model)
    return dish_model
