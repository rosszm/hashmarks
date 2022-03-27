/**
 * This module consists of all code that relates to the NHL Stats API. This includes the 
 * `NhlStatsClient` that is used for querying the API, as well as several interfaces to improve
 * clarity.
 */

 import Player from "../../../screens/player";
import { Parameters } from "./base";
 import { getQueryString } from "./util";


/** The schedule query string parameters. */
export interface ScheduleParams extends Parameters {
  season?: string;
  gameType?: string | string[];
  teamId?: number | number[];
}

/** A game as represented on the schedule. */
export interface Game {
  gamePk: number;
  link: string;
  teams: {away: Team, home: Team};
}

/**An NHL team */
export interface Team {
  id: number;
  name: string;
}

export interface Plays {
  /** All the plays that occurred during a game */
  allPlays: Play[];
  /** A collection of indexes to scoring plays in `allPlays`. */
  scoringPlays: number[];
  /** A collection of indexes to penalty plays in `allPlays`. */
  penaltyPlays: number[];
  /** The current play of a game. */
  currentPlay: Play[];
}

/** A play that occurs during a game */
export interface Play {
  /** The players involved in the play. */
  players: {
    player: {
      id: number;
    },
    playerType: string;
  }[];
  /** The result of the play. */
  result: {
    event: string,
    eventTypeId: string,
    description: string,
  };
  /** Information about the play. */
  about: {
    eventIdx: number,
    eventId: number,
    period: number,
    periodTime: string,
    dateTime: string,
  };
  /** The on-ice location of the play. */
  coordinates: {
    x?: number,
    y?: number,
  };
}

/** An NHL Player. */
export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  number: string;
  birthday: string;
  age: number;
  birthCity: string;
  birthState: string;
  birthCountry: string;
  nationality: string;
  height: string;
  weight: number;
  currentTeam: {
    id: number;
    name: string;
  }
  position: {
    abbreviation: string;
    name: string;
    type: string
  }
}

/**
 * NHL Stats API Client.
 *
 * This client wraps the NHL Stats API and provides useful methods to query stats data.
 */
export class NhlStatsClient {
  /** The base URI of the Stats API. Uses the API proxy server */
  private _uri: string = process.env.REACT_APP_API_URL_PROD! + "/stats";
  /** The version of the API */
  version: string;

  constructor(version: string) {
    this.version = version;
    if (process.env.NODE_ENV !== "production") {
      this._uri = process.env.REACT_APP_API_URL_DEV! + "/stats";
    }
  }

  /**
   * Retrieves a collection of all the teams from the API.
   *
   * @returns a promise to a collection of teams.
   */
  getTeams(): Promise<Team[]> {
    return fetch(`${this._uri}/${this.version}/teams`)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<{teams: Team[]}>;
      })
      .then(response => response.teams);
  }

  /**
   * Retrieves a specific player from the API.
   *
   * @returns a promise to the player data.
   */
  getPlayer(id: string): Promise<Player> {
    return fetch(`${this._uri}/${this.version}/people/${id}`)
      .then(async response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return (await response.json()).people[0];
      });
  }

  /**
   * Retrieves a schedule of games from the API based on a set of parameters.
   *
   * @param params the query parameters
   * @returns a promise to a collection of games.
   */
  getSchedule(params?: ScheduleParams): Promise<Game[]> {
    return fetch(`${this._uri}/${this.version}/schedule` + getQueryString(params))
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<{dates: {games: Game[]}[]}>;
      }).then(schedule => {
        let games: Game[] = [];
        for (let i=0; i < schedule.dates.length; i++) {
          let date = schedule.dates[i];
          games = games.concat(date.games);
        }
        return games;
    });
  }

  /**
   * Retrieves all the plays/events in a given game from the API.
   *
   * @param gamePk the game primary key
   * @returns the game play/event data
   */
  getPlays(gamePk: number): Promise<Plays> {
    return fetch(`${this._uri}/${this.version}/game/${gamePk}/feed/live`)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<{liveData: {plays: Plays}}>;
      })
      .then(game => game.liveData.plays);
  }
}