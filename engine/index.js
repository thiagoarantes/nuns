import {
  confirmResetGame,
  populateSheetFromStorage,
  selectNun,
  startNextRound,
  toggleModal,
} from "./methods.js";

/**
 * INIT
 */

populateSheetFromStorage();

/**
 * ALL EVENTS
 */

/** Select Nun */
document.querySelector("select.nun").addEventListener("change", (event) => {
  selectNun(event.target.value);
});

/** Modal - Confirm Reset Game */
document
  .querySelector("button.confirm-reset-game")
  .addEventListener("click", () => {
    confirmResetGame();
  });

/** Main Reset Game */
document.querySelector("button.reset-game").addEventListener("click", () => {
  toggleModal();
});

/** Modal - Close Button (X) */
document.querySelector("span.close").addEventListener("click", () => {
  toggleModal();
});

/** Modal - Cancel Button */
document.querySelector("button.cancel-close").addEventListener("click", () => {
  toggleModal();
});

/** Start Next Turn */
document.querySelector("button.add-new-round").addEventListener("click", () => {
  startNextRound();
});
