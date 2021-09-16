import uuid
from functools import lru_cache
from typing import Optional

from pydantic import BaseSettings


class Settings(BaseSettings):
    debug: bool = True
    api_v1_route: str = "/api/v1"
    openapi_route: str = "/api/v1/openapi.json"
    frontend_directory: str = "../.ui-studio/client/build"

    class Config:
        env_prefix = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()
