"""
This flask server acts as a proxy for the NHL API.
"""

from flask import Flask, request, abort
from werkzeug.exceptions import HTTPException
import requests, json


NHL_STATS_API = "https://statsapi.web.nhl.com/api"
NHL_SUGGEST_API = "https://suggest.svc.nhl.com/svc/suggest"

app = Flask(__name__)


@app.route('/stats/<version>/<route>', methods=['GET'])
def stats(version, route):
    """
    Passes the request and returns the response from the NHL Stats API.
    """
    query_str = request.query_string.decode()
    api_response = requests.get(f"{NHL_STATS_API}/{version}/{route}?{query_str}")
    if api_response.ok:
        return api_response.json()
    abort(api_response.status_code)

@app.route('/suggest/<version>/<route>', methods=['GET'])
def suggest(version, route):
    """
    Passes the request and returns the response from the NHL Suggest API
    """
    query = request.args.get("search", "")
    max_suggest = request.args.get('max', "")
    api_response = requests.get(f"{NHL_SUGGEST_API}/{version}/{route}/{query}/{max_suggest}")
    if api_response.ok:
        return api_response.json()
    abort(api_response.status_code)


@app.errorhandler(HTTPException)
def handle_exception(e):
    """Return JSON instead of HTML for HTTP errors."""
    # start with the correct headers and status code from the error
    response = e.get_response()
    # replace the body with JSON
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    })
    response.content_type = "application/json"
    return response


if __name__ == "__main__":
    app.run(host='0.0.0.0')