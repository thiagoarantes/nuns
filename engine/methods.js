import { nunsInitialSpaces, nunsItems, nunsMovements } from "./defaults.js";
import { LOCAL_STORAGE_KEY, MAX_ROUNDS } from "./constants.js";

/** INITIAL STATE */
const objDom = {
  nunSelect: document.querySelector("select.nun"),
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
  objDom.nunSelect.value = name;

  /** Fill nun's image */
  setNumImage(name);

  /** Add as many rounds exist in the local storage */
  rounds.forEach((round) => {
    addRound(round.space, round.movement, round.item);
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
  localRounds.startAt = nunsInitialSpaces[newNun];

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
  const inputItem = lastRow.querySelector(".item");

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
    item: inputItem.value,
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
  const { nunSelect, sheetEmpty, sheetForm } = objDom;

  sheetEmpty.style.display = "none";
  sheetForm.style.display = "block";

  nunSelect.disabled = true;
}

function closeGame() {
  const { nunSelect, sheetEmpty, sheetForm } = objDom;

  sheetEmpty.style.display = "block";
  sheetForm.style.display = "none";

  nunSelect.disabled = false;
}

function addRound(_space, _movement, _event) {
  const { buttonNewRound, sheetRows } = objDom;

  const movementOptions = [];
  const itemsOptions = [];

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
  movementSelect.addEventListener("change", (event) => {
    definePossibleMovements(event.target.value, spaceInput);
  });

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

  /** Items */

  const itemWrapper = document.createElement("div");
  itemWrapper.className = "select-wrapper";

  const itemSelect = document.createElement("select");
  itemSelect.className = "item";

  Object.values(nunsItems).forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;

    itemsOptions.push(option);
  });

  itemSelect.append(document.createElement("option"), ...itemsOptions);

  if (_event !== undefined) {
    itemSelect.disabled = true;
    itemSelect.value = _event;
  }

  itemWrapper.append(itemSelect);

  newRow.append(roundDiv, movementWrapper, spaceInput, itemWrapper);

  if (currentRound >= MAX_ROUNDS) {
    buttonNewRound.innerHTML = "No more turns";
    buttonNewRound.setAttribute("disabled", true);
  } else {
    buttonNewRound.innerHTML = `<span class="material-symbols-outlined">subdirectory_arrow_right</span>Start next turn [ ${currentRound + 1} ]`;
  }

  sheetRows.append(newRow);
}

function saveToLocalStorage() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localRounds));
}

function getPreviousEndSpace() {
  if (currentRound === 1) {
    return nunsInitialSpaces[localRounds.name];
  }

  return localRounds.rounds[currentRound - 2].space;
}

function definePossibleMovements(item, spaceInput) {
  if (item === nunsMovements["Standing-Still"]) {
    spaceInput.value = getPreviousEndSpace();

    return;
  }

  // TODO - All the other cases
  spaceInput.value = "";
}
