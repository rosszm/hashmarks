import strawberry
import datetime as dt
from nhlapi.clients.stats import StatsClient


@strawberry.type
class Coord2D:
    """
    Represents an arena coordinate.
    """
    x: int | None
    y: int | None


@strawberry.type
class Period:
    """
    Represents a game period and its related data.
    """
    number: int
    type: str
    time: str


@strawberry.type
class Event:
    """
    Represents an event that occurs during a hockey game.
    """
    game_id: int
    index: int
    type: str
    coordinates: Coord2D
    period: Period
    datetime: str

    @classmethod
    def from_dict(cls, event_dict: dict):
        """
        Creates a new event from a dictionary representation.

        Args:
            dict: the dictionary representation of the event.
        """
        return cls(
            game_id = event_dict.get("game_id"),
            index = event_dict.get("index"),
            type = event_dict.get("type"),
            coordinates = Coord2D(x=event_dict.get("x"), y=event_dict.get("y")),
            period = Period(
                number=event_dict.get("period_number"),
                type=event_dict.get("period_type"),
                time=event_dict.get("period_time"),
            ),
            datetime = event_dict.get("datetime"),
        )
