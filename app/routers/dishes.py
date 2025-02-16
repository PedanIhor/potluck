from fastapi import APIRouter, HTTPException, status
from fastapi.param_functions import Depends

from app.db.database import get_db
from app.auth.oauth2 import get_current_user, CurrentUser
from app.db.schemas import DishScheme, DishBase, CuisineType
from app.db import db_dish

router = APIRouter(
    prefix="/dishes",
    tags=["Dishes"],
)

@router.get("/", response_model=list[DishScheme])
def read_dishes(cuisine: CuisineType = None, db = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    print(cuisine)
    return db_dish.get_all_dishes(db, cuisine)


@router.post("/", response_model=DishScheme)
def create_dish(request: DishBase, db = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    dish = db_dish.create_dish(db, request)
    return dish

