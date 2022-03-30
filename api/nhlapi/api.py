"""
A FastAPI server that acts as a proxy for the NHL API.
"""

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import strawberry
from strawberry.fastapi import GraphQLRouter
from nhlapi.graphql.schema import Query
from nhlapi.util import forward_request
import os


# Constants for the different API URLs
NHL_STATS_API = "https://statsapi.web.nhl.com/api"
NHL_RECORDS_API = "https://records.nhl.com/site/api"
NHL_SUGGEST_API = "https://suggest.svc.nhl.com/svc/suggest"


app = FastAPI()

origins = ["https://rosszm.github.io"]
if os.getenv("API_ENV", "production") == "development":
    origins = ["*"]
app.add_middleware(CORSMiddleware, allow_origins=origins,  allow_methods=("GET", "POST", "OPTIONS"))

schema = strawberry.Schema(Query)
graphql_app = GraphQLRouter(schema, graphiql=False)
app.include_router(graphql_app, prefix="/graphql")


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
