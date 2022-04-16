#!/bin/sh
# this file acts as an entrypoint to the update script.
source /opt/hockey-db/env/bin/activate
python3 /opt/hockey-db/hockey_db/update_service.py
