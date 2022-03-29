"""
This module provides an interface to the NHL's public facing suggest API.
"""

import httpx


class SuggestClient:
    """
    A client for the public NHL Suggest API.
    """
    base_url: str = "https://suggest.svc.nhl.com/svc/suggest/v1"

    @staticmethod
    def get_players(name: str, limit: int | None = None) -> list[dict]:
        """
        Gets a list of players whose name matches the query string.

        Args:
            name: the player name to search for
            limit: the maximum number of suggestions to return

        Returns:
            The list of players whose name matches; empty list if no players match.
        """
        num_results = ""
        if limit:
            num_results = str(limit)

        response = httpx.get(f"{SuggestClient.base_url}/minplayers/{name}/{num_results}")
        if response.is_success:
            return response.json().get("suggestions")
        return []

    @staticmethod
    def get_active_players(name: str, limit: int | None = None) -> list[dict]:
        """
        Gets a list of active players whose name matches the query string.

        Args:
            name: the player name to search for
            limit: the maximum number of suggestions to return

        Returns:
            The list of active players players whose name matches; empty list if no players match.
        """
        num_results = ""
        if limit:
            num_results = str(limit)

        response = httpx.get(f"{SuggestClient.base_url}/minactiveplayers/{name}/{num_results}")
        if response.is_success:
            return response.json().get("suggestions")
        return []
