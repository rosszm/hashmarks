import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RinkVisualization } from "../components/rink-visualization";
import { PlayerData } from "../nhlapi/schema";
import { PlayerNotFound } from "./error";
import "./player.scss";


/** The GraphQL query for players. */
const GET_PLAYER = gql`
  query getPlayer($id: Int!) {
    player(id: $id) {
      name
      position {
        name
      }
      team {
        name
      }
      number
    }
  }
`;


/**
 * The `PlayerPage` Component.
 *
 * Page for displaying the statistics of an individual NHL Player.
 */
function PlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const intId = parseInt(id!);

  const { data } = useQuery<PlayerData, {id: number}>(
    GET_PLAYER,
    {variables: {id: intId ? intId : -1}}
  );

  useEffect(() => {
    if (data) {
      if (data.player) {
        document.title = `${data.player.name} Stats Visualization - Hashmarks`;
      }
      else {
        document.title = `Player Not Found - Hashmarks`;
      }
    }
  }, [data])

  return (
    <>
      {data?
        data.player ?
        <>
          <div className="player-info">
            <img
              className="player-portrait"
              src={`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${intId}@2x.jpg`}
              />
            <div>
              <h1>{data.player.name}</h1>
              <p>{data.player.team.name}</p>
              <p>#{data.player.number}</p>
              <p>{data.player.position.name}</p>
            </div>
          </div>
          <RinkVisualization playerId={intId}/>
        </>:
        <PlayerNotFound />:
        <p>Loading</p>
    }
    </>
  );
}

export default PlayerPage;
