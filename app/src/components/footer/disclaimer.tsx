import "./disclaimer.scss";

/***
 * Disclaimer footer for the project.
 */
export function Disclaimer() {
  const year = (new Date()).getFullYear()

  return (
    <footer className="container">
      <p className="disclaimer">
        This project is not associated with the NHL or its teams. Data used in this project is
        collected from sources including the NHL, however, this data may be modified and its
        correctness is not guaranteed.

        NHL and the NHL Shield are registered trademarks of the National Hockey League.
        NHL and NHL team marks are the property of the NHL and its teams. © NHL {year}.
        All Rights Reserved.
      </p>
    </footer>
  );
}