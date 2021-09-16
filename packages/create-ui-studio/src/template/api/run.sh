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

gunicorn \
  -k uvicorn.workers.UvicornWorker \
  --bind "localhost:${PORT}" \
  "api:app_factory()"