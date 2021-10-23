from typing import Sequence, Type, TypeVar

from pydantic import BaseConfig, BaseModel, Field


TCustomBaseModel = TypeVar("TCustomBaseModel", bound="CustomBaseModel")


def convert_field_to_camel_case(string: str) -> str:
    return "".join(
        word if index == 0 else word.capitalize()
        for index, word in enumerate(string.split("_"))
    )


class CustomBaseModel(BaseModel):
    class Config(BaseConfig):
        allow_population_by_field_name = True
        alias_generator = convert_field_to_camel_case


class ExampleModel(CustomBaseModel):
    string_field: str = Field(..., alias="stringField")
    number_field: int = Field(..., alias="numberField")
    boolean_field: bool = Field(..., alias="booleanField")


class ExampleModelWithId(ExampleModel):
    id: str