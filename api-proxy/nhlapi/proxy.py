"""
A FastAPI server that acts as a proxy for the NHL API.
"""

from fastapi import FastAPI, Request, Response
from nhlapi.util import forward_request


# Constants for the different API URLs
NHL_STATS_API = "https://statsapi.web.nhl.com/api"
NHL_RECORDS_API = "https://records.nhl.com/site/api"
NHL_SUGGEST_API = "https://suggest.svc.nhl.com/svc/suggest"

app = FastAPI()


@app.get("/stats/{endpoint:path}")
async def stats(request: Request) -> Response:
    """
    Handles GET requests to the NHL Stats API.
    """
    return forward_request(NHL_STATS_API, request)


@app.get("/records/{endpoint:path}")
async def records(request: Request) -> Response:
    """
    Handles GET requests to the NHL Records API.
    """
    return forward_request(NHL_RECORDS_API, request)


@app.get("/suggest/{endpoint:path}")
async def suggest(request: Request):
    """
    Handles GET requests to the NHL Suggest API.
    """
    return forward_request(NHL_SUGGEST_API, request)
