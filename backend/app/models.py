from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, Enum, DateTime
from app.database import Base
import enum


# class Questions(Base):
#     __tablename__ = 'questions'

#     id = Column(Integer, primary_key=True, index=True)
#     question_text = Column(String, index=True)
    
# class Choices(Base):
#     __tablename__ = 'choices'

#     id = Column(Integer, primary_key=True, index=True)
#     choice_text = Column(String, index=True)
#     is_correct = Column(Boolean, default=False)
#     question_id = Column(Integer, ForeignKey("questions.id"))


class GenderEnum(enum.Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    TRANSGENDER = "TRANSGENDER"

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(Text, nullable=False)
    lastname = Column(Text, nullable=False)
    gender = Column(Enum(GenderEnum), nullable=True)
    date_of_birth = Column(DateTime)
    email = Column(Text, unique=True, nullable=False)
    password = Column(Text, nullable=False)
    phone = Column(Text, nullable=False)
    college = Column(String, nullable=True)
    current_location = Column(Text)
    home_town = Column(Text)
    country = Column(Text)
    career_preference_internships = Column(Boolean, default=False)
    career_preference_jobs = Column(Boolean, default=False)
    preferred_work_location = Column(Text)
    preferred_work_mode = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)