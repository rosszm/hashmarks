"""
Unit testing for the nhlapi.proxy module.
"""

from fastapi.testclient import TestClient
from nhlapi.proxy import app


client = TestClient(app)


def test_nonexistant_route():
    response = client.get("/")
    assert response.status_code == 404
    assert response.json() == {"detail": "Not Found"}


def test_route_query_param():
    response = client.get("/stats/v1/people/8447400/stats?stats=statsSingleSeason&season=19801981")
    assert response.status_code == 200
    data = response.json().get("stats")[0]
    assert data.get("type").get("displayName") == "statsSingleSeason"
    assert data.get("splits")[0].get("season") == "19801981"


class TestCORS:
    def test_invalid_origin(self):
        origin = "http://example.com"
        response =  client.get("/stats/v1/people/8447400/", headers={"Origin": origin})
        assert response.headers.get("access-control-allow-origin") == None

    def test_valid_origin(self):
        origin = "https://rosszm.github.io"
        response =  client.get("/stats/v1/people/8447400/", headers={"Origin": origin})
        assert response.headers.get("access-control-allow-origin") == origin

    
class TestStatsRoute:
    def test_valid_endpoint(self):
        response = client.get("/stats/v1/venues/5100")
        assert response.status_code == 200
        assert response.json().get("venues") == [{
            "id" : 5100,
            "name" : "Rogers Place",
            "link" : "/api/v1/venues/5100",
            "appEnabled" : "false"
        }]

    def test_nonexistant_endpoint(self):
        response = client.get("/stats/nonexistant/endpoint")
        assert response.status_code == 404
        assert response.json() == {"detail": "Not Found"}
    

class TestRecordsRoute:
    def test_valid_endpoint(self):
        response = client.get("/records/trophy")
        assert response.status_code == 200
        assert response.json()["data"][0].get("name") == "Stanley Cup"

    def test_nonexistant_endpoint(self):
        response = client.get("/records/nonexistant/endpoint")
        assert response.status_code == 404
        assert response.json() == {"detail": "Not Found"}


class TestSuggestRoute:
    def test_valid_endpoint(self):
        response = client.get("/suggest/v1/minplayers/wayne gretzky")
        assert response.status_code == 200
        assert response.json().get("suggestions") == [
            "8447400|Gretzky|Wayne|0|0|6' 0\"|185|Brantford|ON|CAN|1961-01-26|NYR|C|99|wayne-gretzky-8447400"
        ]

    def test_nonexistant_endpoint(self):
        response = client.get("/suggest/nonexistant/endpoint")
        assert response.status_code == 404
        assert response.json() == {"detail": "Not Found"}
