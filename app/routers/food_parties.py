from fastapi import APIRouter, HTTPException, status
from fastapi.param_functions import Depends

from typing import List

from app.db.database import get_db
from app.db.models import FoodParty
from app.auth.oauth2 import get_current_user, CurrentUser

router = APIRouter(
    prefix="/food-party",
    tags=["Food Party"],
)

@router.get("/")
def read_food_parties(db = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    return db.query(FoodParty).all()