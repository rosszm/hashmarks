"""
A flask server that acts as a proxy for the NHL API.
"""

from flask import Flask, Response, abort, request
from werkzeug.exceptions import HTTPException
from flask_cors import CORS, cross_origin
import requests
import json


NHL_STATS_API = "https://statsapi.web.nhl.com/api"
NHL_RECORDS_API = "https://records.nhl.com/site/api"
NHL_SUGGEST_API = "https://suggest.svc.nhl.com/svc/suggest"

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


@app.route("/stats", defaults={"path": ""})
@app.route('/stats/<path:path>')
@cross_origin()
def stats(path: str) -> Response:
    """
    Handles GET requests to the NHL Stats API.
    """
    return forward_request(NHL_STATS_API, path, request.query_string)


@app.route("/records", defaults={"path": ""})
@app.route('/records/<path:path>')
@cross_origin()
def stats(path: str) -> Response:
    """
    Handles GET requests to the NHL Records API.
    """
    return forward_request(NHL_RECORDS_API, path, request.query_string)


@app.route("/suggest", defaults={"path": ""})
@app.route('/suggest/<path:path>')
@cross_origin()
def suggest(path: str) -> Response:
    """
    Handles GET requests to the NHL Suggest API.
    """
    return forward_request(NHL_SUGGEST_API, path, request.query_string)


def forward_request(base_url: str, path: str, query: str) -> Response:
    """
    Forwards proxy requests to an API with the given path parameters.

    Parameters
    ----------
    base_url : str
        The base url of the API
    path : str
        The path paramters of the request

    Returns
    -------
    Response
        The response of the API to the request parameters
    """
    url: bytes = f"{base_url}/{path}?".encode() + query
    response = requests.get(url)
    if response.ok:
        return response.json()

    abort(response.status_code)


@app.errorhandler(HTTPException)
def handle_exception(e):
    """
    Return JSON instead of HTML for HTTP errors.
    """
    response = e.get_response()
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    })
    response.content_type = "application/json"
    return response
