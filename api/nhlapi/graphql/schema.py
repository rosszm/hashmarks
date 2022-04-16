from datetime import datetime
import strawberry
from nhlapi.graphql.definitions import PlayerSuggestion, Player, Team, Event
from nhlapi.clients.stats import StatsClient
from nhlapi.clients.suggest import SuggestClient
from nhlapi.clients import database as db

@strawberry.type
class Query:
    @strawberry.field
    def player(self, id: int) -> Player | None:
        """
        Returns a player from the NHL Stats API if the request is successful; otherwise None.
        """
        player = StatsClient.get_player(id)
        if player:
            return Player.from_dict(player)

    @strawberry.field
    def team(self, id: int) -> Team | None:
        """
        Returns a team from the NHL Stats API if the request is successful; otherwise None.
        """
        team = StatsClient.get_team(id)
        if team:
            return Team.from_dict(team)

    @strawberry.field
    def player_suggestions(self, name: str, limit: int | None = None) -> list[PlayerSuggestion]:
        """
        Returns a list of player suggestions from the NHL Suggest API.
        """
        suggestions = SuggestClient.get_active_players(name, limit=limit)
        return [PlayerSuggestion.from_str(player) for player in suggestions]

    @strawberry.field
    def player_events(self,
        player_id: int,
        event_type: str,
        player_type: str,
        season: str
    ) -> list[Event]:
        """
        Returns a list of events that were performed by a given player and occur from the start date
        to the end date.
        """
        events = db.get_player_events(player_id, event_type, player_type, season)
        return [Event.from_dict(event) for event in events]