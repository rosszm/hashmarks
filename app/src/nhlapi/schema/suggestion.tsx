/** Represents an individual player suggestion. */
export interface PlayerSuggestion {
  id: number;
  name: string;
  position: string;
  team: string;
  number: string;
}


/** Represents the data returned from a player suggestion query to the graphQL API. */
export interface PlayerSuggestionData {
  playerSuggestions: PlayerSuggestion[]
}