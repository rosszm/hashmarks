import strawberry
from nhlapi.graphql.definitions import PlayerSuggestion, Player, Team
from nhlapi.clients.stats import StatsClient
from nhlapi.clients.suggest import SuggestClient

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