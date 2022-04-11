from datetime import datetime
import psycopg
from psycopg.rows import dict_row


DB_NAME = "hockey"
DB_USER = "postgres"


def get_player_events(
    player_id: int,
    event_type: str,
    player_type: str,
    start: datetime,
    end: datetime):
    """
    Queries the database for an event involving a specific player over a period of time.

    Args:
        player_id: the ID of the player.
        player_type: the type of the player in the event. This is used to identify the event type.
            For example, a shot event has the player types "shooter" and "goalie"
    """
    with psycopg.connect(dbname=DB_NAME, user=DB_USER, row_factory=dict_row) as conn:
        return conn.execute(
            """
            SELECT
            event.game_id AS game_id,
            event.index AS index,
            event.type AS type,
            event.x AS x,
            event.y AS y,
            period.number AS period_number,
            period.type AS period_type,
            event.period_time AS period_time,
            event.datetime AS datetime
            FROM involved_player
            INNER JOIN event ON involved_player.event_id = event.id
            INNER JOIN game ON event.game_id = game.id
            INNER JOIN period ON event.period_id = period.id
            WHERE involved_player.player_id = %s
            AND event.type = %s
            AND involved_player.type = %s
            AND event.datetime BETWEEN %s::TIMESTAMPTZ AND %s::TIMESTAMPTZ
            """,
            [player_id, event_type, player_type, start, end],
        ).fetchall()
