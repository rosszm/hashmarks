import strawberry


@strawberry.type
class Team:
    """
    Represents an NHL team.
    """
    id: int
    team_name: str
    location_name: str
    abbreviation: str

    @strawberry.field
    def name(self) -> str:
        return self.location_name + " " + self.team_name

    @classmethod
    def from_dict(cls, dict: dict):
        return cls(
            id = dict.get("id"),
            abbreviation = dict.get("abbreviation"),
            location_name = dict.get("locationName"),
            team_name = dict.get("teamName"),
        )
