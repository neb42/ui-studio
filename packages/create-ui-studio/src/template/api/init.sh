#!/usr/bin/env bash

if ! command -v pyenv &> /dev/null
    pyenv virtualenv 3.9 ui-studio-server
    pyenv activate ui-studio-server
then
else
    # Handle different or no virtual env
    echo "pyenv and pyenv-virtualenv required"
    exit 1
fi

if ! command -v poetry &> /dev/null
then
    echo "Poetry installed"
else
    echo "Installing poetry"
    curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
fi
