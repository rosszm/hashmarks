"""
This module provides an interface to the NHL's public facing stats API.
"""

import httpx


class StatsClient:
    """
    A client for the public NHL Stats API.
    """
    base_url: str = "https://statsapi.web.nhl.com/api/v1"

    @staticmethod
    def get_player(id: int) -> dict | None:
        """
        Gets the player corresponding to a given player id.

        Args:
            id: the id number of the player

        Returns:
            The player represented as dictionary if the request is successful; otherwise None.
        """
        response = httpx.get(f"{StatsClient.base_url}/people/{id}")
        if response.is_success:
            return response.json().get("people")[0]

    @staticmethod
    def get_team(id: int) -> dict | None:
        """
        Gets the team corresponding to a given team id.

        Args:
            id: the id number of the team

        Returns:
            The team represented as dictionary if the request is successful; otherwise None.
        """
        response = httpx.get(f"{StatsClient.base_url}/teams/{id}")
        if response.is_success:
            return response.json().get("teams")[0]