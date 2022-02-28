/**
 * This module consists of several utility functions and structures that help in querying the API.
 */

import { Parameters } from './base';


/** The different types of games. */
export enum GameType {
  /** NHL pre-season game */
  PreSeason = "PR",
  /** NHL regular season game */
  RegularSeason = "R",
  /** NHL playoff game */
  Playoffs = "p",
  /** NHL All-Star game */
  AllStar = "A",
  /** NHL All-Star women's game */
  AllStarWomen = "WA",
  /** Olympic Hockey game */
  Olympic = "O",
  /** World Cup of Hockey exhibition game */
  WorldCupEx = "WCOH_EXH",
  /** World Cup of Hockey preliminary game */
  WorldCupPrelim = "WCOH_PRELIM",
  /** World cup of hockey semifinal or final game */
  WorldCupFinal = "WCOH_FINAL",
}

/**
 * Enumeration on common play types to make filtering data easier.
 */
export enum PlayType {
  Faceoff = "FACEOFF",
  Hit = "HIT",
  Giveaway = "GIVEAWAY",
  Goal = "GOAL",
  Shot = "SHOT",
  MissedShot = "MISSED_SHOT",
  Penalty = "PENALTY",
  Fight = "FIGHT",
  Takeaway = "TAKEAWAY",
  BlockedShot = "BLOCKED_SHOT",
}

/** 
 * Returns an HTTP query string from a set of parameters.
 */
export function getQueryString(params?: Parameters): string {
  let str = "";
  if (!params) return str;
  let entries = Object.entries(params);
  for (let i=0; i < entries.length; i++) {
    i === 0 ? str += '?' : str += '&';
    str += `${entries[i][0]}=${entries[i][1]}`
  }
  return str;
}