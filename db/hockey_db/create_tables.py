import psycopg
from psycopg import sql
from constants import DB_NAME, DB_USER


CREATE_TABLE_QUERIES = [
    sql.SQL("""
        CREATE TABLE IF NOT EXISTS arena (
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        )"""
    ),
    sql.SQL("""
        CREATE TABLE IF NOT EXISTS game (
            id INTEGER PRIMARY KEY,
            home_team_id INTEGER NOT NULL,
            away_team_id INTEGER NOT NULL,
            arena_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            season INTEGER NOT NULL,
            datetime TIMESTAMPTZ NOT NULL,

            FOREIGN KEY (arena_id) REFERENCES arena(id)
        )"""
    ),
    sql.SQL("""
        CREATE TABLE IF NOT EXISTS period (
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            number INTEGER NOT NULL,
            type TEXT NOT NULL,

            UNIQUE (number, type)
        )"""
    ),
    sql.SQL("""
        CREATE TABLE IF NOT EXISTS event (
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            index INTEGER,
            game_id INTEGER,
            type TEXT NOT NULL,
            x INTEGER,
            y INTEGER,
            period_id INTEGER NOT NULL,
            period_time INTERVAL NOT NULL,
            datetime TIMESTAMPTZ NOT NULL,

            UNIQUE (game_id, index),
            FOREIGN KEY (game_id) REFERENCES game(id),
            FOREIGN KEY (period_id) REFERENCES period(id)
        )"""
    ),
    sql.SQL("""
        CREATE TABLE IF NOT EXISTS involved_player (
            event_id INTEGER,
            player_id INTEGER,
            type TEXT,

            PRIMARY KEY (event_id, player_id),
            FOREIGN KEY (event_id) REFERENCES event(id)
        )"""
    ),
]

def create_tables(conn_str: str):
    """
    Creates the tables for the hockey database if they do not already exist.

    Args:
        conn_str: the database connection string
    """
    with psycopg.connect(conn_str) as conn:
        with conn.cursor() as cur:
            for query in CREATE_TABLE_QUERIES:
                cur.execute(query)


if __name__ == "__main__":
    create_tables(f"dbname={DB_NAME} user={DB_USER}")
