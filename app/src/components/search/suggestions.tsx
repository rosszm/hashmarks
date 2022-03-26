import { useNavigate } from 'react-router-dom';
import { SuggestedPlayer } from "../../common/nhl-api";


/**
 * The SuggestionList Component.
 *
 * This component represents a list of suggested players that appears under the player search.
 */
export function SuggestionList({
  players,
  selected,
  selectById,
}: {
  players: SuggestedPlayer[],
  selected: {id: number, index: number},
  selectById: (id: number) => void,
}) {
  return (
    <table className="search-suggestion-box">
      <thead>
        <tr>
          <th>Name</th><th>Position</th><th>Team</th><th>#</th>
        </tr>
      </thead>
      <tbody>
        {players.map(player => <SuggestionListItem key={player.id} player={player}
          selected={{id: selected.id, set: selectById}}/>)}
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
  selected
}: {
  player: SuggestedPlayer,
  selected: { id: number, set: (id: number) => void }
}) {
  const navigate = useNavigate();

  return (
    <tr className={`search-suggestion ${selected.id === player.id ? "suggestion-hover": ""}`}
      onMouseOver={() => selected.set(player.id)}
      onClick={() => navigate(`/player/${player.id}`)}
    >
      <td>{player.firstName} {player.lastName}</td>
      <td>{player.position}</td>
      <td>{player.team}</td>
      <td>{player.number}</td>
    </tr>
  )
}
