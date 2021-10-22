from fastapi import APIRouter

from api.routes import example 

router = APIRouter()

router.include_router(example.router, prefix="/example")
