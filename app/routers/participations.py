from fastapi import APIRouter, HTTPException, status
from fastapi.param_functions import Depends

from app.db.database import get_db
from app.auth.oauth2 import get_current_user, CurrentUser
from app.db.schemas import ParticipationBase, ParticipationScheme
from app.db import db_participation

router = APIRouter(
    prefix="/participation",
    tags=["Participation"],
)


@router.post("/", response_model=ParticipationScheme)
def create_participation(request: ParticipationBase, db = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    if not current_user.admin and current_user.id != request.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    participation = db_participation.create_participation(db, request)
    return participation


@router.get("/{party_id}", response_model=list[ParticipationScheme])
def read_participations(party_id: int, db = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    return db_participation.get_participations_for_party(db, party_id)


@router.post("/{participation_id}/dishes")
def add_dishes_to_participation(participation_id: int, dishes_ids: list[int], db = Depends(get_db), current_user: CurrentUser = Depends(get_current_user)):
    participation = db_participation.get_participation(db, participation_id)

    if participation is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Participation not found")

    return db_participation.add_dishes_to_participation(db, participation_id, dishes_ids)
