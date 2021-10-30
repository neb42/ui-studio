#!/usr/bin/env bash

start() {
  echo "Starting api..."
}

stop() {
  echo "Stoping api..."
}

if declare -f "$1" > /dev/null
then
  "$@"
else
  echo "'$1' is not a known function name" >&2
  exit 1
fi
