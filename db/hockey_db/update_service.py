"""
This module contains the code for the hockey database update service. To facilitate this, it
provides a number of helper functions and a main `update` function that is called when the update
service file is run.
"""

from datetime import datetime, timedelta
import psycopg
from constants import DB_NAME, DB_USER
import httpx


NHL_API_URL = "https://statsapi.web.nhl.com/api/v1"


def most_recent_datetime(db_conn_str: str) -> datetime | None:
    """
    Returns the datetime of the most recent game in the database.
    """
    with psycopg.connect(db_conn_str) as conn:
        exists = conn.execute("""
            SELECT EXISTS (
            SELECT FROM pg_tables
            WHERE schemaname = 'public' AND tablename  = 'game')
            """).fetchone()[0]
        if exists:
            date = conn.execute("""
                SELECT DISTINCT ON (datetime) datetime
                FROM game
                ORDER BY datetime DESC
                """
            ).fetchone()
            if date != None:
                return date[0]


def update(db_conn_str: str, fm: datetime, to: datetime):
    """
    Updates the database with events between two dates (inclusive).

    Args:
        db_conn_str: the database connection string.
        fm: the start date
        to: the end date
    """
    game_ids = get_scheduled_game_ids(fm, to)
    for id in game_ids:
        with psycopg.connect(db_conn_str) as conn:
            insert_game(id, conn)


def get_scheduled_game_ids(fm: datetime, to: datetime) -> set:
    """
    Returns a set of IDs for games that have occurred since the given datetime. Games that are still
    in progress will not be included in the set.
    """
    games = set()
    response = httpx.get(NHL_API_URL + f"/schedule?startDate={fm.date()}&endDate={to.date()}")
    if response.is_success:
        json = response.json()
        for date in json["dates"]:
            games.update(
                {g["gamePk"] for g in date["games"] if g["status"]["detailedState"] == "Final"})

    return games


def insert_game(id: int, conn: psycopg.Connection):
    """
    Inserts the game into the database.

    Args:
        game: a dictionary representing a game
        cur: the database cursor
    """
    game = get_game(id)
    if game == None:
        return None

    cur = conn.execute("""
        INSERT INTO arena (name) VALUES (%s)
        ON CONFLICT (name) DO NOTHING
        """, [game["arena"]])
    arena_id = cur.execute("SELECT id FROM arena WHERE name = %s", [game["arena"]]).fetchone()[0]

    cur.execute("""
        INSERT INTO game
        (id, home_team_id, away_team_id, arena_id, type, season, datetime)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (id)
        DO NOTHING;
        """, [
        game["id"],
        game["home_team_id"],
        game["away_team_id"],
        arena_id,
        game["type"],
        game["season"],
        game["datetime"]
    ])
    insert_events(game, cur)


def get_game(id: int) -> dict | None:
    """
    Returns the game data for a given game ID.
    """
    response = httpx.get(NHL_API_URL + f"/game/{id}/feed/live")
    if response.is_success:
        json = response.json()
        return {
            "id": json["gamePk"],
            "home_team_id": json["gameData"]["teams"]["home"]["id"],
            "away_team_id": json["gameData"]["teams"]["away"]["id"],
            "arena": json["gameData"]["venue"]["name"],
            "type": json["gameData"]["game"]["type"],
            "season": json["gameData"]["game"]["season"],
            "datetime": json["gameData"]["datetime"]["dateTime"],
            "events": json["liveData"]["plays"]["allPlays"]
        }


def insert_events(game: dict, cur: psycopg.Cursor):
    """
    Inserts the events of a game into the database.

    Args:
        game: a dictionary representing a game
        cur: the database cursor
    """
    for event in game["events"]:
        cur.execute("""
            INSERT INTO period (number, type) VALUES (%s, %s)
            ON CONFLICT (number, type) DO NOTHING
            """, [
            event["about"]["period"],
            event["about"]["periodType"]])
        period_id = cur.execute("""
            SELECT id FROM period WHERE number = %s AND type = %s
            """, [
            event["about"]["period"],
            event["about"]["periodType"]]).fetchone()[0]

        cur.execute("""
            INSERT INTO event
            (index, game_id, type, x, y, period_id, period_time, datetime)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (index, game_id) DO NOTHING
            """, [
            event["about"]["eventIdx"],
            game["id"],
            event["result"]["eventTypeId"],
            event["coordinates"].get("x"),
            event["coordinates"].get("y"),
            period_id,
            "00:" + event["about"]["periodTime"],
            event["about"]["dateTime"]])

        event["id"] = cur.execute("""
            SELECT id FROM event WHERE game_id = %s AND index = %s
            """, [
            game["id"],
            event["about"]["eventIdx"]]).fetchone()[0]

        insert_involved_players(event, cur)


def insert_involved_players(event: dict, cur: psycopg.Cursor):
    """
    Inserts the palyers involved in an event into the database.

    Args:
        event: a dictionary representing an event
        cur: the database cursor
    """
    players_involved = event.get("players")
    if players_involved == None:
        return None

    for player in players_involved:
        cur.execute("""
            INSERT INTO involved_player (event_id, player_id, type)
            VALUES (%s, %s, %s)
            ON CONFLICT (event_id, player_id) DO NOTHING
            """, [
            event["id"],
            player["player"]["id"],
            player["playerType"]])


if __name__ == "__main__":
    conn_str = f"dbname={DB_NAME} user={DB_USER}"
    last_updated = most_recent_datetime(conn_str)
    now = datetime.utcnow()
    if last_updated == None:
        last_updated = now - timedelta(days=1)
    update(conn_str, last_updated, now)
