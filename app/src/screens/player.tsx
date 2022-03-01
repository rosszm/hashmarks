import { useEffect, useState } from "react";
import { NhlStatsClient, Play, ScheduleParams } from "../common/nhl-api/src/stats";


function Player() {
  // eslint-disable-next-line 
  const [goals, setGoals] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);
  
  const nhlStatsClient = new NhlStatsClient("v1"); 

  const params = {
    season: "20212022",
    gameType: "R", 
    teamId: 1
  };

  // On Component Mount
  useEffect(() => { 
    /**
     * Sets the goals state to a collection acquired from the NHL stats API based on the given
     * parameters.
     * 
     * @param params the parameters for the NHL stats API
     * @post Sets `goals` to a new state
     */
    async function setGoalsFromNhlApi(params: ScheduleParams) {
      let games = await nhlStatsClient.getSchedule(params).then(games => {
        return games.map(async game => {
          let plays = await nhlStatsClient.getPlays(game.gamePk);
          return plays.scoringPlays.map(idx => plays.allPlays[idx]);
        });
      })
      let goals = games.reduce(async (g1, g2) => (await g1).concat(await g2));
      setGoals(await goals);
      setLoading(false);
    }
    setGoalsFromNhlApi(params);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <h1>Player</h1>
      <p>loading: {`${loading}`}</p>
    </>
  );
}

export default Player;
