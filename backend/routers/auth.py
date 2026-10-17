from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth import verify_password, get_password_hash, create_access_token, get_current_user
from config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register_user(user_in: schemas.UserRegister, db: Session = Depends(get_db)):
    """Create a unified user account (acts as Creator, Backer, and Audience)."""
    existing = db.query(models.User).filter(models.User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    user = models.User(
        full_name=user_in.full_name,
        email=user_in.email.lower(),
        password_hash=get_password_hash(user_in.password),
        streak_count=1,  # Welcome bonus streak
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Initial welcome bonus activity
    activity = models.Activity(
        user_id=user.id,
        activity_type=models.ActivityType.STREAK_UPDATE,
        message=f"Welcome to Amplify! $5 match credit and your Day 1 impact streak have been activated."
    )
    db.add(activity)
    db.commit()

    access_token = create_access_token(data={"sub": user.id})
    return schemas.Token(access_token=access_token, token_type="bearer")

@router.post("/login", response_model=schemas.Token)
def login_user(user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    """Authenticate and return JWT access token."""
    user = db.query(models.User).filter(models.User.email == user_in.email.lower()).first()
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.id})
    return schemas.Token(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    """Retrieve current authenticated user."""
    return current_user
