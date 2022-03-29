import strawberry
from nhlapi.graphql.definitions.player import Player
from nhlapi.clients.stats import StatsClient


@strawberry.type
class PlayerSuggestion:
    """
    Represents a suggested NHL Player with some basic information.
    """
    id: int
    first_name: str
    last_name: str
    number: str
    team: str
    position: str

    @strawberry.field
    def name(self) -> str:
        """
        The full name of the suggested player.
        """
        return self.first_name + " " + self.last_name

    @strawberry.field
    def player(self) -> Player:
        """
        The full details of the suggested player.
        """
        return Player.from_dict(StatsClient.get_player(self.id))

    @classmethod
    def from_str(cls, suggestion: str):
        """
        Creates a player suggestion from a suggestion string.

        Args:
            suggestion: a suggestion string from the NHL Suggest API.
        """
        args = suggestion.split('|')
        return cls(
            id = args[0],
            last_name = args[1],
            first_name = args[2],
            team = args[11],
            position = args[12],
            number = args[13],
        )
