import { nunsInitials, nunsMovements } from "./defaults.js";
import { LOCAL_STORAGE_KEY } from "./constants.js";

/** INITIAL STATE */
const objDom = {
  sheetForm: document.querySelector(".sheet-form"),
  sheetEmpty: document.querySelector(".sheet-empty"),
  sheetRows: document.querySelector(".sheet-rows"),
  buttonNewRound: document.querySelector(".add-new-round"),
  resetModal: document.querySelector(".modal"),
};

const localRounds = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {
  name: null,
  startAt: 0,
  rounds: [],
};

let currentRound = 0;

/** PUBLIC METHODS */

export function populateSheetFromStorage() {
  const { name, rounds } = localRounds;

  /** Fill nun's name */
  const nunSelect = document.querySelector("select.nun");
  nunSelect.value = name;

  /** Fill nun's image */
  setNumImage(name);

  /** Add as many rounds exist in the local storage */
  rounds.forEach((round) => {
    addRound(round.space, round.movement, round.event);
  });

  /** Add a new round */
  currentRound = rounds.length;
  addRound();

  if (name) {
    openGame();
  }
}

export function selectNun(newNun) {
  localRounds.name = newNun;
  localRounds.startAt = nunsInitials[newNun];

  saveToLocalStorage();
  setNumImage(newNun);
  openGame();
}

export function setNumImage(name) {
  document.body.className = name?.toLowerCase();
}

export function toggleModal() {
  const modal = objDom.resetModal;

  if (modal.classList.contains("open")) {
    modal.classList.remove("open");

    return;
  }

  modal.classList.add("open");
}

export function startNextTurn() {
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
    movement: inputMovement.value,
    event: inputEvent.value,
  });

  saveToLocalStorage();

  /** Step 3 - Create new round */

  addRound();
}

export function confirmResetGame() {
  const { sheetRows, buttonNewRound } = objDom;

  localRounds.name = null;
  localRounds.startAt = 0;
  localRounds.rounds = [];

  sheetRows.innerHTML = "";

  saveToLocalStorage();

  currentRound = 1;

  populateSheetFromStorage();
  toggleModal();

  buttonNewRound.removeAttribute("disabled");

  closeGame();
}

/** PRIVATE METHODS */

function openGame() {
  const { sheetEmpty, sheetForm } = objDom;

  sheetEmpty.style.display = "none";
  sheetForm.style.display = "block";
}

function closeGame() {
  const { sheetEmpty, sheetForm } = objDom;

  sheetEmpty.style.display = "block";
  sheetForm.style.display = "none";
}

function addRound(_space, _movement, _event) {
  const { buttonNewRound, sheetRows } = objDom;

  currentRound = currentRound + 1;

  const newRow = document.createElement("div");
  newRow.className = "sheet-row";

  const roundDiv = document.createElement("div");
  roundDiv.className = "round";
  roundDiv.innerHTML = currentRound;

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

  const movementOptions = [];

  Object.values(nunsMovements).forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;

    movementOptions.push(option);
  });

  movementSelect.append(document.createElement("option"), ...movementOptions);

  if (_movement !== undefined) {
    movementSelect.disabled = true;
    movementSelect.value = _movement;
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

  if (_event !== undefined) {
    eventSelect.disabled = true;
    eventSelect.value = _event;
  }

  eventWrapper.append(eventSelect);

  newRow.append(roundDiv, spaceInput, movementWrapper, eventWrapper);

  if (currentRound >= 15) {
    buttonNewRound.innerHTML = "No more turns";
    buttonNewRound.setAttribute("disabled", true);
  } else {
    buttonNewRound.innerHTML = `Start next turn [ ${currentRound + 1} ]`;
  }

  sheetRows.append(newRow);
}

function saveToLocalStorage() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localRounds));
}
