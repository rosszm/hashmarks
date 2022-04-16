"""
The tests for Hockey DB update service.

PREREQUISITES:
    - postgres database with the name `test` must exist and is active.
    - `hockey_db.init` passes its tests.
"""

from datetime import datetime, timezone
import psycopg
import pytest
from hockey_db import update_service
from hockey_db.create_tables import create_tables

DB_NAME = "test"
DB_USER = "postgres"
CONN_STR = f"dbname={DB_NAME} user={DB_USER}"


@pytest.fixture(autouse=True)
def setup():
    create_tables(CONN_STR)
    yield
    with psycopg.connect(CONN_STR) as conn:
        with conn.cursor() as cur:
            cur.execute("DROP TABLE IF EXISTS arena CASCADE"
                ).execute("DROP TABLE IF EXISTS game CASCADE"
                ).execute("DROP TABLE IF EXISTS event CASCADE"
                ).execute("DROP TABLE IF EXISTS period CASCADE"
                ).execute("DROP TABLE IF EXISTS involved_player CASCADE")


def test_most_recent_datetime_none():
    dt = update_service.most_recent_datetime(CONN_STR)
    assert dt == None


def test_most_recent_datetime():
    with psycopg.connect(CONN_STR) as conn:
        with conn.cursor() as cur:
            arena = cur.execute("INSERT INTO arena (name) VALUES ('rink') RETURNING id").fetchone()[0]
            cur.execute("""
            INSERT INTO game
            (id, home_team_id, away_team_id, arena_id, type, season, start_datetime, end_datetime)
            VALUES (0, 0, 1, %s, 'R', '20212022', '2022-01-01 00:00:00 UTC', '2022-01-01 01:00:00 UTC')
            """, [arena])
    dt = update_service.most_recent_datetime(CONN_STR)
    assert dt.astimezone(timezone.utc) == datetime(2022, 1, 1, 0, 0, 0, tzinfo=timezone.utc)


@pytest.mark.asyncio
async def test_update_new_events():
    from_date = datetime(2022, 1, 1, tzinfo=timezone.utc)
    to_date = datetime(2022, 1, 1, tzinfo=timezone.utc)

    await update_service.update(CONN_STR, from_date, to_date)
    with psycopg.connect(CONN_STR) as conn:
        with conn.cursor() as cur:
            games = cur.execute("SELECT * FROM game").fetchone()
            events = cur.execute("SELECT * FROM event").fetchone()
            periods = cur.execute("SELECT * FROM period").fetchone()
            involved_players = cur.execute("SELECT * FROM involved_player").fetchone()

            assert games != None
            assert events != None
            assert periods != None
            assert involved_players != None
