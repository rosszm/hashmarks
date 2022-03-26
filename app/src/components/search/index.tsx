import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { NhlSuggestClient, SuggestedPlayer } from "../../common/nhl-api";
import { IoSearch, IoClose } from 'react-icons/io5';
import { SuggestionList } from "./suggestions";
import "./search.scss"


/**
 * The `NhlPlayerSearch` Component.
 *
 * This component is an input with
 */
export default function NhlPlayerSearch() {
  const [searchText, setSearchText] = useState("");
  const [players, setPlayers] = useState<SuggestedPlayer[]>([]);
  const [selected, setSelected] = useState({id: -1, index: -1});

  const maxResults = 10; // eslint-disable-line
  const minCharsForSuggestion = 3;

  // initialize references to handle the component focus
  const ref = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

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
        setPlayerSuggestions(await nhlSuggestClient.getActivePlayerSuggestions(text, maxResults));
      }
      else {
        setPlayerSuggestions([]);
      }
    }
    updatePlayerSuggestions(searchText);
  }, [searchText, maxResults])

  /**
   * Updates the player suggestion list.
   * @param players the new player list.
   */
   function setPlayerSuggestions(players: SuggestedPlayer[]) {
    setPlayers(players);
    if (players.length > 0) {
      setSelected({id: players[0].id, index: 0})
    }
  }

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

  /** Clears the search query on the given mouse event/ */
  function clearSearchText(event: React.MouseEvent) {
    setSearchText("");
    inputRef.current!.focus();
  }

  /** Sets the selected suggestion based on a given player id. */
  function selectById(id: number) {
    let idx = players.findIndex(player => player.id === id);
    if (idx === -1) return;

    setSelected({id: id, index: idx});
  }

  /** Sets the selected suggestion based on a given player index. */
  function selectByIndex(idx: number) {
    if (idx < 0 || idx >= players.length) return;

    setSelected({id: players[idx].id, index: idx});
  }

  return (
    <div className="search" onKeyDown={event => {
      switch(event.key) {
        case "ArrowUp":
          event.preventDefault();
          selectByIndex(selected.index - 1);
          break;
        case "ArrowDown":
          event.preventDefault();
          selectByIndex(selected.index + 1);
          break;
        case "Enter":
          event.preventDefault();
          navigate(`/player/${selected.id}`);
          break;
        default: break;
      }
    }}>
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
        <SuggestionList players={players} selected={selected} selectById={selectById}/> : ""
      }
    </div>
  );
}
