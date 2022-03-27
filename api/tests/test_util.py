import httpx
import pytest
import uvicorn
from nhlapi.util import forward_request
from fastapi import FastAPI, HTTPException, Request
from tests.helpers.helper import ThreadedServer


# Define the host and port to use for mock APIs
MOCK_HOST = "0.0.0.0"
MOCK_PORT = 5000


@pytest.fixture(scope="class")
def mock_api():
    """
    This fixtures wraps tests with the creation and teardown of a mock API server. The mock API
    runs on a separate child thread while the tests are performed on the main thread.
    """
    app = FastAPI()

    @app.get("/valid/{path_params:path}")
    async def test(path_params: str, q1: str|None=None, q2: str|None=None):
        queries = []
        if q1: queries.append(q1)
        if q2: queries.append(q2)
        if len(queries) == 0: queries = None
        return {"path_params": path_params, "queries": queries}

    config = uvicorn.Config(app, MOCK_HOST, MOCK_PORT, log_level="info")
    server = ThreadedServer(config)
    with server.run_in_thread():
        yield


@pytest.mark.usefixtures("mock_api")
class TestForwardRequest:
    def test_invalid_api_url(self):
        request = Request(scope={
            "type": "http",
            "scheme": "http",
            "method": "PUT",
            "path": "/route",
            "raw_path": b"/route",
            "query_string": b"",
            "headers": {},
            "path_params": {"endpoint": "test"}
        })
        with pytest.raises(httpx.RequestError):
            forward_request("", request)

    def test_missing_endpoint_param(self):
        request = Request(scope={
            "type": "http",
            "scheme": "http",
            "method": "PUT",
            "path": "/route",
            "raw_path": b"/route",
            "query_string": b"",
            "headers": {},
            "path_params": {}
        })
        with pytest.raises(AssertionError):
            forward_request(f"http://{MOCK_HOST}:{MOCK_PORT}", request)

    def test_invalid_route(self):
        request = Request(scope={
            "type": "http",
            "scheme": "http",
            "method": "PUT",
            "path": "/route",
            "raw_path": b"/route",
            "query_string": b"",
            "headers": {},
            "path_params": {"endpoint": ""}
        })
        with pytest.raises(HTTPException) as exc:
            forward_request(f"http://{MOCK_HOST}:{MOCK_PORT}/invalid", request)
        assert exc.value.status_code == 404

    def test_valid_route(self):
        request = Request(scope={
            "type": "http",
            "scheme": "http",
            "method": "PUT",
            "path": "/route",
            "raw_path": b"/route",
            "query_string": b"",
            "headers": {},
            "path_params": {"endpoint": ""}
        })
        response = forward_request(f"http://{MOCK_HOST}:{MOCK_PORT}/valid", request)
        assert response == {
            "path_params": "",
            "queries": None
        }

    def test_valid_endpoint(self):
        request = Request(scope={
            "type": "http",
            "scheme": "http",
            "method": "PUT",
            "path": "/route",
            "raw_path": b"/route",
            "query_string": b"",
            "headers": {},
            "path_params": {"endpoint": "some_endpoint"}
        })
        response = forward_request(f"http://{MOCK_HOST}:{MOCK_PORT}/valid", request)
        assert response == {
            "path_params": "some_endpoint",
            "queries": None
        }

    def test_nested_endpoint(self):
        request = Request(scope={
            "type": "http",
            "scheme": "http",
            "method": "PUT",
            "path": "/route",
            "raw_path": b"/route",
            "query_string": b"",
            "headers": {},
            "path_params": {"endpoint": "some/nested/endpoint"}
        })
        response = forward_request(f"http://{MOCK_HOST}:{MOCK_PORT}/valid", request)
        assert response == {
            "path_params": "some/nested/endpoint",
            "queries": None
        }

    def test_query(self):
        request = Request(scope={
            "type": "http",
            "scheme": "http",
            "method": "PUT",
            "path": "/route",
            "raw_path": b"/route",
            "query_string": b"q1=some_query",
            "headers": {},
            "path_params": {"endpoint": ""}
        })
        response = forward_request(f"http://{MOCK_HOST}:{MOCK_PORT}/valid", request)
        assert response == {
            "path_params": "",
            "queries": ["some_query"]
        }

    def test_multiple_queries(self):
        request = Request(scope={
            "type": "http",
            "scheme": "http",
            "method": "PUT",
            "path": "/route",
            "raw_path": b"/route",
            "query_string": b"q1=first&q2=second",
            "headers": {},
            "path_params": {"endpoint": ""}
        })
        response = forward_request(f"http://{MOCK_HOST}:{MOCK_PORT}/valid", request)
        assert response == {
            "path_params": "",
            "queries": ["first", "second"]
        }
