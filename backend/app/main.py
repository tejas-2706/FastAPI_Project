from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from pydantic import BaseModel,EmailStr
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Annotated, Literal, Optional
from app import models
from app.database import engine, SessionLocal
from sqlalchemy.orm import Session
import bcrypt
from datetime import datetime
import os 

app = FastAPI()
models.Base.metadata.create_all(bind=engine) # it will create all tables and columns

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    college: Optional[str] = None
    current_location: Optional[str] = None
    home_town: Optional[str] = None
    country: Optional[str] = None
    career_preference_internships: Optional[bool] = False
    career_preference_jobs: Optional[bool] = False
    preferred_work_location: Optional[str] = None  # Now optional
    preferred_work_mode: Optional[str] = None
    resume_url: Optional[str] = None

@app.post("/signup")
async def signup(
    db: Annotated[Session, Depends(get_db)],
    firstname: str = Form(...),
    lastname: str = Form(...),
    gender: Optional[str] = Form(None),
    date_of_birth: Optional[datetime] = Form(None),
    email: EmailStr = Form(...),
    password: Optional[str] = Form(None),
    country_code: str = Form(...),
    phone: str = Form(...),
    college: Optional[str] = Form(None),
    current_location: Optional[str] = Form(None),
    home_town: Optional[str] = Form(None),
    country: Optional[str] = Form(None),
    career_preference_internships: Optional[bool] = Form(False),
    career_preference_jobs: Optional[bool] = Form(False),
    preferred_work_location: Optional[str] = Form(None),
    preferred_work_mode: Optional[str] = Form(None),
    resume: Optional[UploadFile] = File(None),
):
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    # Validate phone
    if not phone.isdigit() or len(phone) != 10:
        raise HTTPException(status_code=400, detail="Invalid phone number")

    formatted_phone = country_code + phone

    # Handle password (optional)
    hashed_password = None
    if password:
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    
    # Handle resume upload
    resume_url = None
    if resume:
        contents = await resume.read()
    
        resume_dir = "uploads/resumes"
        os.makedirs(resume_dir, exist_ok=True)  # ✅ Create the folder if it doesn't exist

        # Optional: sanitize filename to avoid invalid characters
        sanitized_email = email.replace("@", "_at_").replace(".", "_")
        filename = f"{resume_dir}/{sanitized_email}_{resume.filename}"

        with open(filename, "wb") as f:
            f.write(contents)

        resume_url = filename

    # Create user instance
    new_user = models.User(
        firstname=firstname,
        lastname=lastname,
        gender=gender,
        date_of_birth=date_of_birth,
        email=email,
        password=hashed_password,
        phone=formatted_phone,
        college=college,
        current_location=current_location,
        home_town=home_town,
        country=country,
        career_preference_internships=career_preference_internships,
        career_preference_jobs=career_preference_jobs,
        preferred_work_location=preferred_work_location,
        preferred_work_mode=preferred_work_mode,
        resume_url=resume_url,
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
    
