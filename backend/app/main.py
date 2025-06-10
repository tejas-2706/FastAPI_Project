from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel,EmailStr
from typing import List, Annotated, Literal, Optional
from app import models
from app.database import engine, SessionLocal
from sqlalchemy.orm import Session
import bcrypt
from datetime import datetime

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

class SignupData(BaseModel):
    firstname: str
    lastname: str
    gender: Optional[Literal["MALE", "FEMALE", "TRANSGENDER"]] = None
    date_of_birth: Optional[datetime] = None
    email: EmailStr
    password: Optional[str] = None  # Now optional
    country_code: str
    phone: str
    current_location: Optional[str] = None
    home_town: Optional[str] = None
    country: Optional[str] = None
    career_preference_internships: Optional[bool] = False
    career_preference_jobs: Optional[bool] = False
    preferred_work_location: Optional[str] = None  # Now optional
    resume_url: Optional[str] = None

@app.post("/signup")
async def signup(
    user: SignupData, 
    db: Annotated[Session, Depends(get_db)]
    ):
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    # Validate phone
    if not user.phone.isdigit() or len(user.phone) != 10:
        raise HTTPException(status_code=400, detail="Invalid phone number")

    formatted_phone = user.country_code + user.phone

    # Handle password (optional)
    hashed_password = None
    if user.password:
        hashed_password = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    # Create user instance
    new_user = models.User(
        firstname=user.firstname,
        lastname=user.lastname,
        gender=user.gender,
        date_of_birth=user.date_of_birth,
        email=user.email,
        password=hashed_password,
        phone=formatted_phone,
        current_location=user.current_location,
        home_town=user.home_town,
        country=user.country,
        career_preference_internships=user.career_preference_internships,
        career_preference_jobs=user.career_preference_jobs,
        preferred_work_location=user.preferred_work_location,
        resume_url=user.resume_url,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully", "user_email": new_user.email}












# @app.post("/questions")
# async def create_questions(question: QuestionBase, db: db_dependency):
#     db_question = models.Questions(question_text = question.question_text)
#     db.add(db_question)
#     db.commit()
#     db.refresh(db_question)
#     for choice in question.choices:
#         db_choice = models.Choices(choice_text = choice.choice_text, is_correct=choice.is_correct, question_id = db_question.id)
#         db.add(db_choice)
#     db.commit()

# @app.get("/questions/{question_id}")
# async def read_question(question_id: int, db: db_dependency):
#     result = db.query(models.Questions).filter(models.Questions.id == question_id).first()
#     if not result:
#         raise HTTPException(status_code=404, detail='Question Not Found')
#     return result

# @app.get("/choices/{question_id}")
# async def read_choices(question_id: int, db: db_dependency):
#     result = db.query(models.Choices).filter(models.Choices.question_id == question_id).all()
#     if not result:
#         raise HTTPException(status_code=404, detail='Choices Not Found')
#     return result






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
    
