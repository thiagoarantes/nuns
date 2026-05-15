import { nunsInitials } from "./defaults.js";
import { LOCAL_STORAGE_KEY } from "./constants.js";

/** INITIAL STATE */
const objDom = {
  sheetForm: document.querySelector(".sheet-form"),
  sheetEmpty: document.querySelector(".sheet-empty"),
  sheetRows: document.querySelector(".sheet-rows"),
  buttonNewRound: document.querySelector(".add-new-round"),
  resetModal: document.querySelector(".modal"),
};

/** PUBLIC METHODS */

export function getFromLocal() {
  return (
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {
      name: null,
      startAt: 0,
      rounds: [],
    }
  );
}

export function populateSheetFromStorage(localRounds, currentRound) {
  const { name, rounds } = localRounds;

  /** Fill nun's name */
  const nunSelect = document.querySelector("select.nun");
  nunSelect.value = name;

  /** Fill nun's image */
  setNumImage(name);

  /** Add as many rounds exist in the local storage */
  rounds.forEach((round, i) => {
    addRound(i + 1, round.space, round.mvmt, round.evnt);
  });

  /** Add a new round */
  currentRound = rounds.length;
  addRound(++currentRound);

  !!name && openGame();
}

export function selectNun(localRounds, newNun) {
  localRounds.name = newNun;
  localRounds.startAt = nunsInitials[newNun];

  saveToLocal(localRounds);
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

export function startNextTurn(localRounds, currentRound) {
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
}

export function confirmResetGame(localRounds, currentRound) {
  const { sheetRows, buttonNewRound } = objDom;

  localRounds.name = null;
  localRounds.startAt = 0;
  localRounds.rounds = [];

  sheetRows.innerHTML = "";

  saveToLocal(localRounds);

  currentRound = 1;

  populateSheetFromStorage(localRounds, currentRound);
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

function addRound(roundNumber, _space, _movement, _event) {
  const { buttonNewRound, sheetRows } = objDom;

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

  if (roundNumber >= 15) {
    buttonNewRound.innerHTML = "No more turns";
    buttonNewRound.setAttribute("disabled", true);
  } else {
    buttonNewRound.innerHTML = `Start next turn [ ${roundNumber + 1} ]`;
  }

  sheetRows.append(newRow);
}

function saveToLocal(localRounds) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localRounds));
}
