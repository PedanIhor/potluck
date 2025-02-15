from sqlalchemy import Boolean, Column, Integer, String, DateTime, Enum, ForeignKey, Table
from sqlalchemy.orm import relationship

from app.db.database import Base

import enum


dishes_participations = Table(
    "dishes_participations",
    Base.metadata,
    Column("dish_id", Integer, ForeignKey("dish.id")),
    Column("participation_id", Integer, ForeignKey("participation.id")),
)


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    hosts_parties = relationship("FoodParty", back_populates="host")
    participations = relationship("Participation", back_populates="user")

    class Config:
        from_attributes = True


class FoodParty(Base):
    __tablename__ = "food_party"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    date = Column(DateTime)
    location = Column(String)

    host = relationship("User", back_populates="hosts_parties")
    participations = relationship("Participation", back_populates="food_party")

    class Config:
        from_attributes = True



class CuisineType(enum.Enum):
    DUTCH = "Dutch"
    ITALIAN = "Italian"
    BELGIAN = "Belgian"
    OTHER = "Other"


class Dish(Base):
    __tablename__ = "dish"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    cuisine = Column(Enum(CuisineType), nullable=False)
    participations = relationship("Participation", secondary=dishes_participations, back_populates="dishes")

    class Config:
        from_attributes = True



class Participation(Base):
    __tablename__ = "participation"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    food_party_id = Column(Integer, ForeignKey("food_party.id"))

    user = relationship("User", back_populates="participations")
    food_party = relationship("FoodParty", back_populates="participations")
    dishes = relationship("Dish", secondary=dishes_participations, back_populates="participations")

    class Config:
        from_attributes = True

