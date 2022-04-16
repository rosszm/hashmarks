import { useEffect } from "react";
import { Link } from "react-router-dom";


/**
 * The Page Not Found Component
 *
 * This component represents the page that is displayed on 404 Not Found Errors.
 */
export function NotFound() {
  useEffect(() => {
    document.title = `Page Not Found - Hashmarks`;
  }, [])

  return (
    <main className="container">
      <h2>Page Not Found</h2>
      <p>The page you are looking for cannot be found at this location.</p>
      <Link to="/">Home Page</Link>
    </main>
  )
}

/**
 * The Player Not Found Component
 *
 * This component represents the player page that is displayed on 404 Not Found Errors.
 */
 export function PlayerNotFound() {
  useEffect(() => {
    document.title = `Page Not Found - Hashmarks`;
  }, [])

  return (
    <main className="container">
      <h2>Player Not Found</h2>
      <p>The player you are looking for cannot be found.</p>
      <Link to="/">Home Page</Link>
    </main>
  )
}