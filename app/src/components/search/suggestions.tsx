import { useNavigate } from 'react-router-dom';
import { PlayerSuggestion, PlayerSuggestionData } from "../../nhlapi/schema";


/**
 * The SuggestionList Component.
 *
 * This component represents a list of suggested players that appears under the player search.
 */
export function SuggestionList({
  data,
  selected,
  select,
}: {
  data: PlayerSuggestionData | undefined,
  selected: number | null,
  select: (id: number | null) => void,
}) {
  return (
    <table className="search-suggestion-box">
      <thead>
        <tr>
          <th>Name</th><th>Position</th><th>Team</th><th>#</th>
        </tr>
      </thead>
      <tbody>
        { data && data.playerSuggestions.length > 0 ?
        data.playerSuggestions.map((player, index) => {
        const isSelected = () => selected !== null ? selected === index : false;
        return <SuggestionListItem
          key={player.id}
          player={player}
          onMouseOver={() => select(index)}
          onMouseOut={() => select(null)}
          isSelected={isSelected}
        />;
        }) :
        <tr className="search-suggestion suggestion-no-match">
          <td>No matching players</td>
        </tr>
        }
      </tbody>
    </table>
  )
}

/**
 * The SuggestionListItem Component.
 *
 * This component represents an individual player suggestion in a list that appears under the player
 * search.
 */
function SuggestionListItem({
  player,
  isSelected,
  onMouseOver,
  onMouseOut,
}: {
  player: PlayerSuggestion,
  isSelected: () => boolean,
  onMouseOver?: () => void,
  onMouseOut?: () => void,
}) {
  const navigate = useNavigate();

  return (
    <tr className={`search-suggestion ${isSelected() ? "suggestion-hover": ""}`}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={() => navigate(`/player/${player.id}`)}
    >
      <td>{player.name}</td>
      <td>{player.position}</td>
      <td>{player.team}</td>
      <td>{player.number}</td>
    </tr>
  )
}
