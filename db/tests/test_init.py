"""
The tests for Hockey DB initialization.

These tests require that there is a pre-existing postgres database named "test", and that postgresql
is active.
"""

import pytest
import psycopg
from hockey_db.init import create_tables

DB_NAME = "test"
DB_USER = "postgres"
CONN_STR = f"dbname={DB_NAME} user={DB_USER}"

class Database:
    """
    Helper class for dealing with databases.
    """
    @staticmethod
    def get_tables():
        """
        Returns the names of the tables in the database.
        """
        with psycopg.connect(CONN_STR) as conn:
            with conn.cursor() as cur:
                return set(cur.execute("""
                    SELECT tablename
                    FROM pg_tables
                    WHERE schemaname = 'public';
                    """).fetchall())

@pytest.fixture
def db():
    return Database

@pytest.fixture(autouse=True)
def drop_tables():
    yield
    with psycopg.connect(CONN_STR) as conn:
        with conn.cursor() as cur:
            cur.execute("DROP TABLE IF EXISTS arena CASCADE"
                ).execute("DROP TABLE IF EXISTS game CASCADE"
                ).execute("DROP TABLE IF EXISTS event CASCADE"
                ).execute("DROP TABLE IF EXISTS period CASCADE"
                ).execute("DROP TABLE IF EXISTS involved_player CASCADE")


def test_create_tables_none_exist(db):
    create_tables(CONN_STR)
    assert db.get_tables() == {("arena",), ("game",), ("event",), ("period",), ("involved_player",)}

def test_create_tables_some_exist(db):
    with psycopg.connect(CONN_STR) as conn:
        with conn.cursor() as cur:
            cur.execute("CREATE TABLE game(id INTEGER PRIMARY KEY)")
    create_tables(CONN_STR)
    assert db.get_tables() == {("arena",), ("game",), ("event",), ("period",), ("involved_player",)}

def test_create_tables_all_exist(db):
    create_tables(CONN_STR)
    create_tables(CONN_STR)
    assert db.get_tables() == {("arena",), ("game",), ("event",), ("period",), ("involved_player",)}
