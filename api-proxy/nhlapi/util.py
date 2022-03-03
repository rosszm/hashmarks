"""
This module contains utility functions for the NHL API proxy server.
"""

from fastapi import Request, Response, HTTPException
import httpx


def forward_request(api_url: str, request: Request) -> Response:
    """
    Forwards a request to an API at the given url. Requires that the request has a path parameter 
    called `endpoint` that represents the endpoint from the API's URL.
    
    Example: 
        The following passes the entire path after `/home` to this function:
    ```py
        @app.get("/home/{endpoint:path}")
        def home(request: Request) -> Response:
            return forward_request("localhost", request)
    ```

    Args:
        api_url: The base url of the API
        path: The path paramters of the request

    Returns:
        The response from the API request at the given endpoint.

    Raises:
        AssertionError: If `request` does not have the path parameter "endpoint"
        HTTPException: If the response was not successful
        httpx.RequestError: If an error occurs issuing a request to the endpoint
    """
    endpoint = request.path_params.get("endpoint")
    
    assert endpoint != None, "forward_request: request must have the path parameter 'endpoint'"
    
    response = httpx.get(f"{api_url}/{endpoint}?{request.query_params}")
    if response.is_success:
        return response.json()

    raise HTTPException(response.status_code)
