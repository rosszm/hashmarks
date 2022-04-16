#!/bin/sh
# entrypoint for the hashmarks API.
cd /opt/hashmarks/api
source api-env/bin/activate
gunicorn -c gunicorn_conf.py nhlapi.api:app