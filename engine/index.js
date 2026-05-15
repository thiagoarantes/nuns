import { nunsInitials } from "./defaults.js";
import {
  addRound,
  closeGame,
  getFromLocal,
  openGame,
  populateSheetFromStorage,
  saveToLocal,
  setNumImage,
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
  const newNun = event.target.value;

  localRounds.name = newNun;
  localRounds.startAt = nunsInitials[newNun];

  saveToLocal(localRounds);
  setNumImage(newNun);
  openGame(domSheetEmpty, domSheetForm);
});

/** Modal - Confirm Reset Game */
document
  .querySelector("button.confirm-reset-game")
  .addEventListener("click", () => {
    localRounds.name = null;
    localRounds.startAt = 0;
    localRounds.rounds = [];

    domSheetRows.innerHTML = "";

    saveToLocal(localRounds);

    currentRound = 1;

    populateSheetFromStorage(
      localRounds,
      currentRound,
      domButton,
      domSheetRows,
      domSheetEmpty,
      domSheetForm,
    );
    toggleModal(domModal);

    domButton.removeAttribute("disabled");

    closeGame(domSheetEmpty, domSheetForm);
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
  /** Step 0 - Check valid round */

  const lastRow = document.querySelectorAll(".sheet-row")[currentRound - 1];
  const inputSpace = lastRow.querySelector(".space");
  const inputMovement = lastRow.querySelector(".movement");
  const inputEvent = lastRow.querySelector(".event");

  if (inputSpace.value === "" || inputMovement.value === "") {
    lastRow.classList.add("animate__animated");
    lastRow.classList.add("animate__shakeX");

    setTimeout(() => {
      lastRow.classList.remove("animate__animated");
      lastRow.classList.remove("animate__shakeX");
    }, 1000);

    return;
  }

  /** Step 1 - Disable last round  */

  const inputs = lastRow.querySelectorAll("input, select");

  inputs.forEach((input) => {
    input.setAttribute("disabled", true);
  });

  /** Step 2 - Save last round to local storage */

  localRounds.rounds.push({
    space: inputSpace.value,
    mvmt: inputMovement.value,
    evnt: inputEvent.value,
  });

  saveToLocal(localRounds);

  /** Step 3 - Create new round */

  addRound(++currentRound, domButton, domSheetRows);
});
