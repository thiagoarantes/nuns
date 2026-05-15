import { nunsInitials } from "./defaults.js";
import {
  saveToLocal,
  setNumImage,
  populateSheetFromStorage,
} from "./methods.js";

const objSheetForm = document.querySelector(".sheet-form");
const objSheetEmpty = document.querySelector(".sheet-empty");
const objSheetRows = document.querySelector(".sheet-rows");
const objButton = document.querySelector(".button-primary");
const modal = document.querySelector(".modal");

let currentRound = 1;

/** start local rounds */
const localRounds = JSON.parse(localStorage.getItem("tarantes-nuns")) || {
  name: null,
  startAt: 0,
  rounds: [],
};

function addRound(roundNumber, _space, _mvmt, _evnt) {
  const newRow = document.createElement("div");
  newRow.className = "sheet-row";

  const roundDiv = document.createElement("div");
  roundDiv.className = "round";
  roundDiv.innerHTML = roundNumber;

  /** Space */

  const spaceInput = document.createElement("input");
  spaceInput.className = "space";
  spaceInput.setAttribute("type", "number");

  if (_space !== undefined) {
    spaceInput.disabled = true;
    spaceInput.value = _space;
  }

  /** Movement */
  const movementWrapper = document.createElement("div");
  movementWrapper.className = "select-wrapper";

  const movementSelect = document.createElement("select");
  movementSelect.className = "movement";

  const optionSS = document.createElement("option");
  optionSS.value = "SS";
  optionSS.innerHTML = "SS";

  const optionS = document.createElement("option");
  optionS.value = "S";
  optionS.innerHTML = "S";

  const optionW = document.createElement("option");
  optionW.value = "W";
  optionW.innerHTML = "W";

  const optionR = document.createElement("option");
  optionR.value = "R";
  optionR.innerHTML = "R";

  movementSelect.append(
    document.createElement("option"),
    optionSS,
    optionS,
    optionW,
    optionR,
  );

  if (_mvmt !== undefined) {
    movementSelect.disabled = true;
    movementSelect.value = _mvmt;
  }

  movementWrapper.append(movementSelect);

  /** Event */
  const eventWrapper = document.createElement("div");
  eventWrapper.className = "select-wrapper";

  const eventSelect = document.createElement("select");
  eventSelect.className = "event";

  const optionK = document.createElement("option");
  optionK.innerHTML = "K";

  const optionSW = document.createElement("option");
  optionSW.innerHTML = "SW";

  eventSelect.append(document.createElement("option"), optionK, optionSW);

  if (_evnt !== undefined) {
    eventSelect.disabled = true;
    eventSelect.value = _evnt;
  }

  eventWrapper.append(eventSelect);

  newRow.append(roundDiv, spaceInput, movementWrapper, eventWrapper);

  if (roundNumber >= 15) {
    objButton.innerHTML = "No more turns";
    objButton.setAttribute("disabled", true);
  } else {
    objButton.innerHTML = `Start next turn [ ${currentRound + 1} ]`;
  }

  objSheetRows.append(newRow);
}

function toggleModal() {
  if (modal.classList.contains("open")) {
    modal.classList.remove("open");
    return;
  }

  modal.classList.add("open");
}

function openGame() {
  objSheetEmpty.style.display = "none";
  objSheetForm.style.display = "block";
}

function closeGame() {
  objSheetEmpty.style.display = "block";
  objSheetForm.style.display = "none";
}

populateSheetFromStorage(localRounds, currentRound);

/**
 * ALL EVENTS
 */

/** Select Nun */
document.querySelector("select.nun").addEventListener("change", (event) => {
  const newNun = event.target.value;

  localRounds.name = newNun;
  localRounds.startAt = nunsInitials[newNun];

  saveToLocal(localRounds);

  /** Fill nun's image */
  setNumImage(newNun);

  openGame();
});

/** Modal - Confirm Reset Game */
document
  .querySelector("button.confirm-reset-game")
  .addEventListener("click", () => {
    localRounds.name = null;
    localRounds.startAt = 0;
    localRounds.rounds = [];

    objSheetRows.innerHTML = "";

    saveToLocal(localRounds);

    currentRound = 1;

    populateSheetFromStorage(localRounds, currentRound);
    toggleModal();

    objButton.removeAttribute("disabled");

    closeGame();
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

  addRound(++currentRound);
});
