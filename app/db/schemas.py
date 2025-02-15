from pydantic import BaseModel
from datetime import datetime
import typing as t


class UserBase(BaseModel):
    email: str
    is_active: bool = True
    is_superuser: bool = False
    first_name: str = None
    last_name: str = None


class UserOut(UserBase):
    pass


class UserCreate(UserBase):
    password: str

    class Config:
        from_attributes = True


class UserEdit(UserBase):
    password: t.Optional[str] = None

    class Config:
        from_attributes = True


class User(UserBase):
    id: int

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str = None
    permissions: str = "user"


class FoodPartyBase(BaseModel):
    name: str
    description: str = None
    date: datetime
    location: str
    host_id: int


class FoodPartyScheme(BaseModel):
    id: int
    name: str
    description: str = None
    date: datetime
    location: str
    host_id: int
    participations: t.List[int]

    class Config:
        from_attributes = True


class ParticipationBase(BaseModel):
    user_id: int
    food_party_id: int
    dishes: t.List[int]


class ParticipationScheme(BaseModel):
    id: int
    user_id: int
    food_party_id: int
    dishes: t.List[int]

    class Config:
        from_attributes = True
