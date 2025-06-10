from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Annotated
from app import models
from app.database import engine, SessionLocal
from sqlalchemy.orm import Session


app = FastAPI()
models.Base.metadata.create_all(bind=engine) # it will create all tables and columns

class ChoiceBase(BaseModel):
    choice_text: str
    is_correct: bool

class QuestionBase(BaseModel):
    question_text: str
    choices: List[ChoiceBase]

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


from fastapi import APIRouter, Request, Response, HTTPException, Depends
from ..dependencies.authorization import authorize_user
from typing import Literal
import bcrypt
from pydantic import BaseModel
from datetime import date, datetime, timedelta
import time
import os
import jwt
import boto3
import random

router = APIRouter()

class UserData(BaseModel):
    firstname: str
    lastname: str
    email: str
    password: str
    country_code: str
    phone: str
    work_experience: Literal["FRESHER", "EXPERIENCED"]

class LoginData(BaseModel):
    email: str
    password: str

@router.post("/signup")
async def signup(request: Request, user: UserData):
    try:
        print("hi")
        async with request.app.state.pool.acquire() as conn:
            user_exists = await conn.fetchval("SELECT 1 FROM users WHERE email=$1", user.email)

            if user_exists:
                raise HTTPException(status_code=400, detail="email is already registered")
            
            salt = bcrypt.gensalt()
            password_bytes = str.encode(user.password)
            hashed_password = bcrypt.hashpw(password_bytes, salt).decode("utf-8")

            if len(user.phone) != 10:
                raise HTTPException(status_code=500, detail="invalid length of phone number")
            
            formatted_phone = user.country_code + user.phone

            user_data = await conn.fetchrow("""
                INSERT INTO users (firstname, lastname, email, password, phone, work_experience)
                VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING (email)
                """, 
                user.firstname, 
                user.lastname, 
                user.email, 
                hashed_password, 
                formatted_phone, 
                user.work_experience
            )

            return {"message": "user registered successfully", "user_email": user_data["email"]}
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="an unexpected error occurred")

@router.post("/login")
async def login(request: Request, response: Response, login_data: LoginData):
    try:
        async with request.app.state.pool.acquire() as conn:
            user_data = await conn.fetchrow("SELECT id, firstname, lastname, phone, password FROM users WHERE email = $1", login_data.email)

            if not user_data:
                raise HTTPException(status_code=400, detail="user not found")
            
            match = bcrypt.checkpw(str.encode(login_data.password), str.encode(user_data["password"]))

            if not match:
                raise HTTPException(status_code=400, detail="incorrect password")
            
            encoded_jwt = jwt.encode({"user_id": user_data["id"], "exp": time.time()+3600*24}, os.getenv("JWT_SECRET"), algorithm="HS256")

            response.headers["Authorization"]=f"Bearer {encoded_jwt}"

            return {
                "message": "login successfull", 
                "user": {
                    "firstname": user_data["firstname"], 
                    "lastname": user_data["lastname"], 
                    "email": login_data.email,
                    "phone": user_data["phone"],
                }
            }

    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="an unexpected error occurred")















@app.post("/questions")
async def create_questions(question: QuestionBase, db: db_dependency):
    db_question = models.Questions(question_text = question.question_text)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    for choice in question.choices:
        db_choice = models.Choices(choice_text = choice.choice_text, is_correct=choice.is_correct, question_id = db_question.id)
        db.add(db_choice)
    db.commit()

@app.get("/questions/{question_id}")
async def read_question(question_id: int, db: db_dependency):
    result = db.query(models.Questions).filter(models.Questions.id == question_id).first()
    if not result:
        raise HTTPException(status_code=404, detail='Question Not Found')
    return result

@app.get("/choices/{question_id}")
async def read_choices(question_id: int, db: db_dependency):
    result = db.query(models.Choices).filter(models.Choices.question_id == question_id).all()
    if not result:
        raise HTTPException(status_code=404, detail='Choices Not Found')
    return result


# class Item(BaseModel):
#     text: str 
#     is_done: bool = False

# items = []

# @app.get("/")
# def root():
#     return {"hello":"world"}

# @app.post("/items")
# def add_item(item: Item):
#     items.append(item)
#     return items

# @app.get("/items",response_model=list[Item])
# def list_items(limit: int = 10):
#     return items[0:limit]

# @app.get("/items/{item_id}", response_model=Item)
# def get_item(item_id : int) -> Item:
#     if item_id < len(items):
#         item = items[item_id]
#         return item
#     else:
#         raise HTTPException(status_code=404, detail=f"Item {item_id} Not found")
    
