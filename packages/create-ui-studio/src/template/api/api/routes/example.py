from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from api import models


router = APIRouter()


@router.get(
    "", response_model=models.ExampleModel, summary="Get example model", name="get_example_model"
)
def get_example_model():
    return {
      "string_field": "a string",
      "number_field": 10,
      "boolean_field": True,
    } 

@router.get(
    "/cheese/bar", response_model=str, summary="Get example model", name="get_example_model"
)
def get_example_model():
    return 'foo'


@router.get(
    "/{id}", response_model=models.ExampleModelWithId, summary="Get example model with id", name="get_example_model_with_id"
)
def get_example_model_with_id(id: str):
    return {
      "id": id,
      "string_field": "a string",
      "number_field": 10,
      "boolean_field": True,
    } 


@router.post(
    "",
    summary="Example action",
    status_code=status.HTTP_201_CREATED,
    name="example_action",
)
def example_action():
    print("Do something")