import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { PlayerData } from "../nhlapi/schema";
import { NotFound } from "./error";


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
  const intId = parseInt(id!);

  const { data } = useQuery<PlayerData, {id: number}>(
    GET_PLAYER,
    {variables: {id: intId ? intId : -1}}
  );

  return (
    <>
      {data?
        data.player ?
        <>
          <h1>{data.player.name}</h1>
          <p>{data.player.team.name}</p>
          <p>{data.player.number}</p>
          <p>{data.player.position.name}</p>
        </>:
        <NotFound />:
        <p>Loading</p>
    }
    </>
  );
}

export default PlayerPage;
