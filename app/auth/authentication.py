from fastapi import APIRouter, HTTPException, status
from fastapi.param_functions import Depends
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm.session import Session
from app.db.database import get_db
from app.db import models
from app.db.hash import Hash
from app.auth import oauth2

router = APIRouter(
    tags=["authentication"]
)


@router.post('/token', status_code=status.HTTP_201_CREATED)
def get_token(
        request: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == request.username).first()
    if not user or not Hash.verify(user.hashed_password, request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid credentials")

    access_token = oauth2.create_access_token(data={'sub': str(user.id)})

    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'user_id': user.id,
        'email': user.email,
    }
