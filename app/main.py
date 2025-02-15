from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.db import models, schemas, crud, database

app = FastAPI()

@app.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    return crud.create_user(db=db, user=user)

@app.get("/users/{user_id}", response_model=schemas.UserOut)
def read_user(user_id: int, db: Session = Depends(database.get_db)):
    user = crud.get_user(db, user_id=user_id)
    if user is None:
        return {"error": "User not found"}
    return user