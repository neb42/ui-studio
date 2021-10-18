import os

from fastapi import APIRouter, FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from api.routes.api import router as api_router
from api.settings import Settings, get_settings


def get_app(settings: Settings = None) -> FastAPI:
    settings = settings if settings is not None else get_settings()

    app = FastAPI(debug=settings.dev, openapi_url=settings.openapi_route)

    router = APIRouter(prefix=settings.api_v1_route)
    router.include_router(api_router)
    app.include_router(router)

    if not settings.dev:
      # Serve static files
      app.mount(
          "/static",
          StaticFiles(directory=os.path.join(settings.frontend_directory, "static")),
          name="static",
      )

      templates = Jinja2Templates(directory=settings.frontend_directory)

    # We assign settings_ to settings after the scope of settings has been narrowed
    # from Optional[Settings] to Settings and use settings_ inside the nested function
    # See:
    # https://mypy.readthedocs.io/en/stable/common_issues.html#narrowing-and-inner-functions
    settings_ = settings

    if not settings.dev:
      @app.route("/{full_path:path}")
      async def catch_all(request: Request):
        return templates.TemplateResponse("index.html", {"request": request})

    return app
