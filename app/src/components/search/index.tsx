import React, { useEffect, useState } from "react";
import { NhlSuggestClient, SuggestedPlayer } from "../../common/nhl-api";
import { IoSearch, IoClose } from 'react-icons/io5';
import "./search.scss"

/**
 * The `NhlPlayerSearch` Component.
 * 
 * This component is an input with 
 */
export default function NhlPlayerSearch() {
  const [searchText, setSearchText] = useState("");
  const [players, setPlayers] = useState<SuggestedPlayer[]>([]);
  const [selected, setSelected] = useState(0); // eslint-disable-line
  const [maxResults, setMaxResults] = useState(8); // eslint-disable-line
  const minCharsForSuggestion = 3;
  
  // initialize references to handle the component focus
  const ref = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Update player suggestions
  useEffect(() => {
    const nhlSuggestClient = new NhlSuggestClient("v1");

    /**
     * Updates the players state with the player suggestions from the NHL Suggest API based on 
     * some search text.
     * 
     * @param text the search text
     * @post sets `players` to a new state
     */
    async function updatePlayerSuggestions(text: string) {
      if (text.length >= minCharsForSuggestion) {
        setPlayers(await nhlSuggestClient.getActivePlayerSuggestions(text, maxResults));
      }
      else {
        setPlayers([]);
      }
    } 
    updatePlayerSuggestions(searchText);
  }, [searchText, maxResults])

  // On mount
  useEffect(() => {
    if(inputRef.current)
      inputRef.current.focus()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Updates `searchText` to a new value provided by the change event.
   * @param event the change event
   * @post sets `searchText` to a new state
   */
  function onSearchTextChange(value: string) {
    setSearchText(value);
  }

  function clearSearchText(event: React.MouseEvent) {
    setSearchText("");
    inputRef.current!.focus();
  }
 
  return (
    <div className="search" ref={ref}>
      <div className={`search-box search-box-focused`}>
        <div className="search-icon" onClick={() => inputRef.current!.focus()}>
          <IoSearch />
        </div>
        <input className="search-input" 
          ref={inputRef}
          value={searchText}
          onChange={({ target: { value } }) => onSearchTextChange(value)}
          placeholder="Search a Player..."
          autoFocus
        />
        {searchText.length > 0 ?
          <div className="search-icon clear-icon" >
            <IoClose onClick={clearSearchText} />
          </div> : ""
        }
        
      </div>
      {searchText.length >= minCharsForSuggestion && players.length > 0 ? 
        <SuggestionList players={players} /> : ""
      }
    </div>
  );
}

/**
 * The SuggestionList Component.
 * 
 * This component represents a list of suggested players that appears under the player search.
 * 
 * @param players A list of suggested players
 */
function SuggestionList({players}: {players: SuggestedPlayer[]}) {
  return (
    <table className="search-suggestion-box">
      <thead>
        <tr>
          <th>Name</th><th>Position</th><th>Team</th><th>#</th>
        </tr>
      </thead>
      <tbody>
        {players.map(player => <SuggestionListItem key={player.id} player={player} />)}
      </tbody>
    </table>
  )
}

/**
 * The SuggestionListItem Component.
 * 
 * This component represents an individual player suggestion in a list that appears under the player
 * search.
 * 
 * @param player the suggested player
 */
function SuggestionListItem({player}: {player: SuggestedPlayer}) {
  console.log(player)
  return (
    <tr className="search-suggestion">
      <td>{player.firstName} {player.lastName}</td>
      <td>{player.position}</td>
      <td>{player.team}</td>
      <td>{player.number}</td>
    </tr>
  )
}
