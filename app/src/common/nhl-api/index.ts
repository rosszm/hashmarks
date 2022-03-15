/**
 * This module is an abstraction on the public NHL API. Note that this does not cover the entire
 * NHL API, only the parts which are required for its use within the hashmarks app.
 *
 * This module is is partially inspired by Andre Fischbacher's
 * [Nhl.Api](https://github.com/Afischbacher/Nhl.Api) implementation in C#.
 * Notable mentions also include Drew Hynes'
 * [NHL API documentation](https://gitlab.com/dword4/nhlapi)
 */

export * from "./src/stats";
export * from "./src/suggest";
export { GameType, PlayType } from "./src/util";