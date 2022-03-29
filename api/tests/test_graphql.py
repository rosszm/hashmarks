"""
Unit testing for the graphQL API.
"""

from nhlapi.api import schema


class TestGraphQLQuery:
    def test_player_valid(self):
        query = """
            query TestQuery($id: Int!) {
                player(id: $id) {
                    id
                    name
                }
            }
        """
        player = {
            "id": 8471675,
            "name": "Sidney Crosby"
        }
        result = schema.execute_sync(query, variable_values={"id": player["id"]})
        assert result.errors == None
        assert result.data["player"] == player

    def test_player_invalid(self):
        query = """
            query TestQuery($id: Int!) {
                player(id: $id) {
                    id
                    name
                }
            }
        """
        result = schema.execute_sync(query, variable_values={"id": -1})
        assert result.errors == None
        assert result.data["player"] == None

    def test_player_team(self):
        query = """
            query TestQuery($id: Int!) {
                player(id: $id) {
                    id
                    name
                    team {
                        id
                        name
                    }
                }
            }
        """
        player = {
            "id": 8471675,
            "name": "Sidney Crosby",
            "team": {
                "id": 5,
                "name": "Pittsburgh Penguins",
            },
        }
        result = schema.execute_sync(query, variable_values={"id": player["id"]})
        assert result.errors == None
        assert result.data["player"] == player

    def test_team_valid(self):
        query = """
            query TestQuery($id: Int!) {
                team(id: $id) {
                    id
                    name
                }
            }
        """
        team = {
            "id": 22,
            "name": "Edmonton Oilers"
        }
        result = schema.execute_sync(query, variable_values={"id": team["id"]})
        assert result.errors == None
        assert result.data["team"] == team

    def test_team_invalid(self):
        query = """
            query TestQuery($id: Int!) {
                team(id: $id) {
                    id
                    name
                }
            }
        """
        result = schema.execute_sync(query, variable_values={"id": -1})
        assert result.errors == None
        assert result.data["team"] == None

    def test_player_suggestion_valid(self):
        query = """
            query TestQuery($name: String!) {
                playerSuggestions(name: $name) {
                    id
                    name
                }
            }
        """
        result = schema.execute_sync(query, variable_values={"name": "connor mc"})
        assert result.errors == None
        assert result.data["playerSuggestions"] == [
            {"id": 8482220, "name": "Connor McClennon"},
            {"id": 8478402, "name": "Connor McDavid"},
            {"id": 8481580, "name": "Connor McMichael"}
        ]

    def test_player_suggestion_empty(self):
        query = """
            query TestQuery($name: String!) {
                playerSuggestions(name: $name) {
                    id
                    name
                }
            }
        """
        result = schema.execute_sync(query, variable_values={"name": "asdf"})
        assert result.errors == None
        assert result.data["playerSuggestions"] == []