/** Represents an event that occurs during a game. */
export interface Event {
  coordinates: {
    x: number,
    y: number,
  }
}

/** Represents the response data from an event query to the graphQL API. */
export interface EventData {
  playerEvents: Event[];
}
