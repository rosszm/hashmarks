import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { EventData } from "../../nhlapi/schema"
import { RinkChart } from "./rink-chart";
import Select from 'react-select';


/** The stat types that can be displayed for a skater. */
const SKATER_STAT_OPTIONS = [
  {value: {eventType: "SHOT", playerType: "Shooter"}, label: "Shots"},
  {value: {eventType: "GOAL", playerType: "Shooter"}, label: "Goals"},
  {value: {eventType: "GOAL", playerType: "Shooter"}, label: "Assists"},
  {value: {eventType: "BLOCKED_SHOT", playerType: "Blocker"}, label: "Blocked Shots"},
  {value: {eventType: "TAKEAWAY", playerType: "PlayerID"}, label: "Takeaways"},
  {value: {eventType: "GIVEAWAY", playerType: "PlayerID"}, label: "Giveaways"},
  {value: {eventType: "HIT", playerType: "Hitter"}, label: "Hits Given"},
  {value: {eventType: "HIT", playerType: "Hittee"}, label: "Hits Received"},
]

/** The stat types that can be displayed for a goalie. */
const GOALIE_STAT_OPTIONS = [
  {value: {eventType: "SHOT", playerType: "Goalie"}, label: "Saves"},
]

/** The seasons the that can be displayed. Note the value should have no hyphen. */
const SEASON_OPTIONS = [
  {value: "20212022", label: "2021-2022"},
]

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
export function RinkVisualization({playerId, position}: {playerId: number, position: string}) {
  const statOpts = position === "Goalie" ? GOALIE_STAT_OPTIONS : SKATER_STAT_OPTIONS;

  const [eventType, setEventType] = useState("SHOT");
  const [playerType, setPlayerType] = useState(position === "Goalie" ? "Goalie" : "Shooter");
  const [season, setSeason] = useState(SEASON_OPTIONS[0].value);

  const { data } = useQuery<EventData, GetEventArgs>(
    GET_PLAYER_EVENTS,
    {variables: {
      playerId: playerId,
      eventType: eventType,
      playerType: playerType,
      season: season,
    }}
  );

  return (
    <div className="rink-vis">
      <div className="rink-vis-menu">
        <Select id="stat-select" className="rink-vis-select"
          options={statOpts}
          defaultValue={statOpts[0]}
          onChange={option => {
            setEventType(option!.value.eventType);
            setPlayerType(option!.value.playerType);
          }}
        />
        <Select className="rink-vis-select"
          options={SEASON_OPTIONS}
          defaultValue={SEASON_OPTIONS[0]}
          onChange={option => setSeason(option!.value)}
        />
        {
          // event selection menu
          // season selection menu
        }
      </div>
      <RinkChart data={data} />
    </div>
  );
}