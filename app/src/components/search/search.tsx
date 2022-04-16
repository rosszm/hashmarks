import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoClose } from 'react-icons/io5';
import { SuggestionList } from "./suggestions";
import "./search.scss"
import { gql, useQuery } from "@apollo/client";
import { PlayerSuggestionData } from "../../nhlapi/schema";


/** The GraphQL query for searching players. */
const SEARCH_PLAYER = gql`
  query searchPlayer($name: String!, $limit: Int!) {
    playerSuggestions(name: $name, limit: $limit) {
      id
      name
      position
      team
      number
    }
  }
`;


/**
 * The `NhlPlayerSearch` Component.
 *
 * Search input for querying active NHL Players.
 */
export function NhlPlayerSearch() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");
  const [inputText, setInputText] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const maxResults = 10;
  const minCharsForSuggestion = 3;
  const navigate = useNavigate();
  const { data, previousData } = useQuery<
    PlayerSuggestionData,
    {name: string, limit: number}
  >(
    SEARCH_PLAYER,
    { variables: { name: searchText, limit: maxResults}
  });


  // focus search input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);


  /**
   * Clears the search query on the given mouse event.
   *
   * @param _event the mouse event.
   * @post sets `searchText` to an empty string.
   */
  function clearSearchText(_event: React.MouseEvent) {
    setInputText("");
    setSearchText("");
    inputRef.current!.focus();
  }

  /**
   * Handles when a key is pressed down.
   *
   * @param event the keyboard event.
   * @post sets `selected` to a new index on ArrowUp or ArrowDown.
   * @post sets `inputText` to new value.
   * @post sets ``
   * @post navigates to a new page on Enter.
   */
  function handleKeyDown(event: React.KeyboardEvent) {
    switch(event.key) {
      case "ArrowUp":
        event.preventDefault();
        if (data) selectPrevSuggestion(data);
        else if (previousData) selectPrevSuggestion(previousData);
        break;

      case "ArrowDown":
        event.preventDefault();
        if (data) selectNextSuggestion(data);
        else if (previousData) selectNextSuggestion(previousData);
        break;

      case "Enter":
        event.preventDefault();
        if (data) navigateSelectedPage(data);
        else if (previousData) navigateSelectedPage(previousData);
        break;

      default: break;
    }
  }

  /**
   * Selects the previous suggestion from the suggestion data.
   *
   * @param data the suggestion data.
   */
  function selectPrevSuggestion(data: PlayerSuggestionData) {
    if (selected !== null) {
      if (selected === 0) {
        select(null);
        setInputText(searchText);
      }
      else select(selected - 1, true);
    }
    else if(data.playerSuggestions.length > 0) {
      select(data.playerSuggestions.length - 1, true);
    }
  }

  /**
   * Selects the next suggestion from the suggestion data.
   *
   * @param data the suggestion data.
   */
  function selectNextSuggestion(data: PlayerSuggestionData) {
    if (selected !== null) {
      if (selected === data.playerSuggestions.length - 1) {
        select(null);
        setInputText(searchText);
      }
      else select(selected + 1, true);
    }
    else if (data.playerSuggestions.length > 0) {
      select(0, true);
    }
  }

  /**
   * Selects the a player suggestion based on the given suggestion index.
   *
   * Indices outside the valid range (less than 0 or greater than the number of suggestions), are
   * clamped to the nearest valid index. e.g., -1 becomes 0.
   *
   * Sets the select suggestion to `null` if the given index is null or `data` is undefined.
   *
   * @param idx the suggestion index
   * @post sets `selected` to the given index.
   * @post sets `inputText` to the name of the selected suggestion.
   */
   function select(idx: number | null, setInput: boolean = false) {
    if (!data || idx === null) return setSelected(null);

    let value = idx;
    if (idx < 0) {
      value = 0;
    } else if (idx >= data.playerSuggestions.length) {
      value = data.playerSuggestions.length - 1;
    }
    if (setInput) setInputText(data.playerSuggestions[value].name);
    setSelected(value);
  }

  /**
   * Navigates to page of the selected suggestion. If no suggestion is selected, Navigates to the
   * first suggestion if it exists.
   *
   * @param data the suggestion data.
   */
  function navigateSelectedPage(data: PlayerSuggestionData) {
    if (selected !== null) {
      navigate(`/player/${data.playerSuggestions[selected].id}`);
    } else if (data.playerSuggestions.length > 0) {
      navigate(`/player/${data.playerSuggestions[0].id}`);
    }
  }


  return (
    <div className="search" onKeyDown={handleKeyDown}>
      <div className={`search-box search-box-focused`}>
        <div className="search-icon" onClick={() => inputRef.current!.focus()}>
          <IoSearch />
        </div>
        <input className="search-input"
          ref={inputRef}
          value={inputText}
          onChange={({ target: { value } }) => {
            setInputText(value);
            setSearchText(value);
          }}
          placeholder="Search a Player..."
          autoFocus
        />
        {searchText.length > 0 ?
          <div className="search-icon clear-icon" >
            <IoClose onClick={clearSearchText} />
          </div> : ""
        }
      </div>
      {searchText.length >= minCharsForSuggestion ?
        <SuggestionList
          data={data? data : previousData}
          selected={selected}
          select={select}
        /> : ""
      }
    </div>
  );
}
