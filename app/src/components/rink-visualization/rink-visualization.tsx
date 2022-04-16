import { gql, useQuery } from "@apollo/client";
import { useRef, useState } from "react";
import { EventData } from "../../nhlapi/schema"
import { RinkChart } from "./rink-chart";


/** The GraphQL query for events. */
const GET_PLAYER_EVENTS = gql`
  query getEvents(
      $playerId: Int!,
      $eventType: String!,
      $playerType: String!,
      $season: String!,
  ) {
    playerEvents(
      playerId: $playerId,
      eventType: $eventType,
      playerType: $playerType,
      season: $season,
    ) {
      coordinates {
        x,
        y,
      }
    }
  }
`;

interface GetEventArgs {
  playerId: number;
  eventType: string;
  playerType: string;
  season: string;
}

/**
 * The Hockey Rink Visualization.
 */
export function RinkVisualization({playerId}: {playerId: number}) {
  const [eventType, setEventType] = useState("GOAL");
  const [playerType, setPlayerType] = useState("Scorer");
  const [season, setSeason] = useState("2021-2022");

  const { data } = useQuery<EventData, GetEventArgs>(
    GET_PLAYER_EVENTS,
    {variables: {
      playerId: playerId,
      eventType: eventType,
      playerType: playerType,
      season: season.replace('-', ''),
    }}
  );

  return (
    <div className="rink-vis">
      <div className="rink-vis-menu">
        {
          // event selection menu
          // season selection menu
        }
      </div>
      <RinkChart data={data} />
    </div>
  );
}