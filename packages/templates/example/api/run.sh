#!/usr/bin/env bash

PORT=

while test $# -gt 0; do
  case "$1" in
    -p)
      shift
      if test $# -gt 0; then
        PORT=$1
      else
        echo "No port specified"
        exit 1
      fi
      shift
      ;;
    --port*)
      PORT=$1
      shift
      ;;
    *)
      break
      ;;
  esac
done

if ! command -v pyenv &> /dev/null
then
    # Handle different or no virtual env
    echo "pyenv and pyenv-virtualenv required"
    exit 1
else
    if ! [ -d "$(pyenv root)/versions/3.9.7" ]
    then
        echo "Installing python 3.9.7..."
        pyenv install 3.9.7
    else
        echo "Python 3.9.7 is already installed"
    fi

    if ! [ -d "$(pyenv root)/versions/ui-studio-api" ]
    then
        echo "Creating ui-studio-api virtualenv..."
        pyenv virtualenv 3.9.7 ui-studio-api
    else
        echo "Using existing ui-studio-api virtualenv"
    fi

    echo "Activating ui-studio-api virtualenv..."
    eval "$(pyenv init -)"
    eval "$(pyenv virtualenv-init -)"
    pyenv activate ui-studio-api
fi

if ! command -v poetry &> /dev/null
then
    echo "Installing poetry"
    curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
else
    echo "Poetry is already installed"
fi

export PATH="$HOME/.poetry/bin:$PATH"
export PATH="$HOME/.pyenv/versions/ui-studio-api/bin:$PATH"

poetry install

exec gunicorn \
   --reload \
  -k uvicorn.workers.UvicornWorker \
  --bind "localhost:${PORT}" \
  "api:app_factory()"