import strawberry
from enum import Enum
from nhlapi.graphql.definitions.team import Team
from nhlapi.clients.stats import StatsClient


@strawberry.type
class Location:
    """
    Represents a city location.
    """
    city: str
    state_province: str
    country: str


@strawberry.enum
class Handedness(Enum):
    RIGHT = "R"
    LEFT = "L"


@strawberry.type
class Position:
    """
    Represents a position in the game of hockey.
    """
    code: str
    name: str
    type: str
    abbreviation: str


@strawberry.type
class Player:
    """
    Represents an NHL Player
    """
    id: int
    first_name: str
    last_name: str
    number: str | None
    active: bool
    age: int
    birth_date: str
    birth_location: Location
    nationality: str
    height: str
    weight: int
    rookie: bool
    handedness: Handedness
    roster_status: bool
    position: Position

    team_id: strawberry.Private[int | None]

    @strawberry.field
    def name(self) -> str:
        """
        The full name of the player.
        """
        return self.first_name + " " + self.last_name

    @strawberry.field
    def team(self) -> Team | None:
        """
        The current team of the player.
        """
        if self.team_id:
            return Team.from_dict(StatsClient.get_team(self.team_id))

    @classmethod
    def from_dict(cls, player_dict: dict):
        """
        Creates a new player from a dictionary representation.

        Args:
            dict: the dictionary representation of the player. The dict keys are expected to be
            camel case.
        """
        currentTeam: dict | None = player_dict.get("currentTeam")
        team_id: int | None = None
        if currentTeam:
            team_id = currentTeam.get("id")

        return cls(
            id = player_dict.get("id"),
            first_name = player_dict.get("firstName"),
            last_name = player_dict.get("lastName"),
            number = player_dict.get("primaryNumber"),
            active = player_dict.get("active"),
            position = player_dict.get("primaryPosition"),
            age = player_dict.get("currentAge"),
            birth_date = player_dict.get("birthDate"),
            birth_location = Location(
                city = player_dict.get("birthCity"),
                state_province = player_dict.get("birthStateProvince"),
                country = player_dict.get("birthCountry"),
            ),
            nationality = player_dict.get("nationality"),
            height = player_dict.get("height"),
            weight = player_dict.get("weight"),
            rookie = player_dict.get("rookie"),
            handedness = player_dict.get("shootsCatches"),
            roster_status = player_dict.get("rosterStatus"),
            team_id = team_id
        )
