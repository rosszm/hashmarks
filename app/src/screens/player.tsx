import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NhlStatsClient, Play, Player, ScheduleParams } from "../common/nhl-api/src/stats";


function PlayerPage() {
  const { id } = useParams();

  const [data, setData] = useState<Player|undefined>(undefined);

  // eslint-disable-next-line
  const [goals, setGoals] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);

  const nhlStatsClient = new NhlStatsClient("v1");

  const params = {
    season: "20212022",
    gameType: "R",
    teamId: 1
  };

  /** Sets the data state to the player data acquired from the NHL stats API.  */
  async function setPlayerDataFromNhlApi() {
    setData(await nhlStatsClient.getPlayer(id!));
  }

  /**
     * Sets the goals state to a collection acquired from the NHL stats API based on the given
     * parameters.
     *
     * @param params the parameters for the NHL stats API
     * @post Sets `goals` to a new state
     */
   async function setGoalsFromNhlApi() {
    if (data) {
      let params = {
        season: "20212022",
        gameType: "R",
        teamId: data.currentTeam.id
      }
      let games = await nhlStatsClient.getSchedule(params).then(games => {
        return games.map(async game => {
          let plays = await nhlStatsClient.getPlays(game.gamePk);
          return plays.scoringPlays.map(idx => plays.allPlays[idx]).filter(play => {
            return !!play.players.find(p => (p.playerType === "Scorer" && p.player.id === data.id));
          });
        });
      })
      let goals = games.reduce(async (g1, g2) => (await g1).concat(await g2));
      setGoals(await goals);
      setLoading(false);
    }
  }

  // On Component Mount
  useEffect(() => {
    setPlayerDataFromNhlApi();
    setGoalsFromNhlApi();
    if (loading === false) {
      console.log(goals);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <h1>{data?.firstName} {data?.lastName}</h1>
      <p>loading: {`${loading}`}</p>
      <p>{goals.toString()}</p>
    </>
  );
}

export default PlayerPage;
