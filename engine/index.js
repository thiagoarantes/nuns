import {
  confirmResetGame,
  getFromLocal,
  populateSheetFromStorage,
  selectNun,
  startNextTurn,
  toggleModal,
} from "./methods.js";

/**
 * GLOBAL VARIABLES
 */

const domSheetForm = document.querySelector(".sheet-form");
const domSheetEmpty = document.querySelector(".sheet-empty");
const domSheetRows = document.querySelector(".sheet-rows");
const domButton = document.querySelector(".button-primary");
const domModal = document.querySelector(".modal");

const localRounds = getFromLocal();

let currentRound = 1;

/**
 * INIT
 */

populateSheetFromStorage(
  localRounds,
  currentRound,
  domButton,
  domSheetRows,
  domSheetEmpty,
  domSheetForm,
);

/**
 * ALL EVENTS
 */

/** Select Nun */
document.querySelector("select.nun").addEventListener("change", (event) => {
  selectNun(localRounds, domSheetEmpty, domSheetForm);
});

/** Modal - Confirm Reset Game */
document
  .querySelector("button.confirm-reset-game")
  .addEventListener("click", () => {
    confirmResetGame(
      localRounds,
      currentRound,
      domButton,
      domSheetRows,
      domSheetEmpty,
      domSheetForm,
      domModal,
    );
  });

/** Main Reset Game */
document.querySelector("button.reset-game").addEventListener("click", () => {
  toggleModal(domModal);
});

/** Modal - Close Button (X) */
document.querySelector("span.close").addEventListener("click", () => {
  toggleModal(domModal);
});

/** Modal - Cancel Button */
document.querySelector("button.cancel-close").addEventListener("click", () => {
  toggleModal(domModal);
});

/** Start Next Turn */
document.querySelector("button.add-new-round").addEventListener("click", () => {
  startNextTurn(localRounds, currentRound, domButton, domSheetRows);
});
