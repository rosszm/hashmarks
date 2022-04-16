#!/bin/sh
# this file acts as an entrypoint to the update script.
source /opt/hashmarks/db/env/bin/activate
python3 /opt/hashmarks/db/hockey_db/update_service.py
