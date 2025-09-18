from fastapi import APIRouter

from app.deps import CurrentUser
from app.models import UserPublic

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserPublic)
def get_current_user(current_user: CurrentUser):
    return current_user
