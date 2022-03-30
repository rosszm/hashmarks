import { Link } from "react-router-dom";


/**
 * The NotFound Component
 *
 * This component represents the page that is displayed on 404 Not Found Errors.
 */
export function NotFound() {
  return (
    <main className="container">
      <h2>Page Not Found</h2>
      <p>The page you are looking for cannot be found at this location.</p>
      <Link to="/">Home Page</Link>
    </main>
  )
}