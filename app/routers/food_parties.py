from fastapi import APIRouter, HTTPException, status
from fastapi.param_functions import Depends

from typing import List

from app.db.database import get_db
from app.auth.oauth2 import get_current_user, CurrentUser
from app.db.schemas import FoodPartyScheme, FoodPartyBase
from app.db import db_party

router = APIRouter(
    prefix="/food-party",
    tags=["Food Party"],
)

@router.get("/")
def read_food_parties(db = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    return db_party.get_all_further_parties(db)


@router.post("/", response_model=FoodPartyScheme)
def create_food_party(request: FoodPartyBase, db = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    if not current_user.admin and current_user.id != request.host_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    party = db_party.create_food_party(db, request)
    return party


@router.get("/{id}", response_model=FoodPartyScheme)
def read_food_party(id: int, db = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    party = db_party.get_food_party(db, id)
    if party is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Party not found")
    return party