/**
 * This module contains everything relating to the NHL Suggest API. This includes the 
 * `NhlSuggestClient` that is used for querying the API.
 */

import {strict as assert} from "assert";


/**
 * NHL Suggest API Client.
 * 
 * This client wraps the NHL Suggest API and provides methods to retrieve player suggestions.
 */
 export class NhlSuggestClient {
  _uri = "https://suggest.svc.nhl.com/svc/suggest";
  version: string;

  constructor(version: string) {
    this.version = version
  }

  /**
   * Retrieves active player suggestions from the NHL suggest API based on some search text.
   * 
   * @param text the search text
   * @param max the maximum number of suggestions to return
   * @returns a collection of `max` player suggestions
   */
  getActivePlayerSuggestions(text: string, max?: number): Promise<SuggestedPlayer[]> {
    return fetch(`${this._uri}/${this.version}/minactiveplayers/${text}/${max ? max : ""}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<{suggestions: string[]}>;
      })
      .then(response => response.suggestions.map(SuggestedPlayer.fromString));
  }
}

/**
 * An NHL Player
 */
 export class SuggestedPlayer {
  id: number;
  firstName: string;
  lastName: string;
  team: string;
  position: string;
  number: string;

  constructor({id, firstName, lastName, team, position, number}: {
    id: number,
    firstName: string,
    lastName: string,
    team: string,
    position: string,
    number: string,
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.team = team;
    this.position = position;
    this.number = number;
  }

  /**
   * Creates a new player object from a player suggestion string. Player suggestions strings
   * are 
   * 
   * @param str the player suggestion string
   * @returns a player object
   */
   static fromString(str: string): SuggestedPlayer {
    let playerArgs = str.split('|');

    assert(playerArgs.length === 15);

    return new SuggestedPlayer({
      id: parseInt(playerArgs[0]),
      lastName: playerArgs[1],
      firstName: playerArgs[2],
      team: playerArgs[11],
      position: playerArgs[12],
      number: playerArgs[13],
    })
  }
}