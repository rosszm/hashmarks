/** Represents an NHL Player */
export interface Player {
  name: string;
  position: {
    name: string;
  }
  team: {
    name: string;
  }
  number: string;
}

/** Represents the response data from a player query to the graphQL API. */
export interface PlayerData {
  player: Player;
}
