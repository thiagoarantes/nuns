const objSheetForm = document.querySelector(".sheet-form");
const objSheetEmpty = document.querySelector(".sheet-empty");
const objSheetRows = document.querySelector(".sheet-rows");
const objButton = document.querySelector(".button-primary");
const objProfile = document.querySelector(".nun-pic");
const modal = document.querySelector(".modal");
let currentRound = 1;

/** start local rounds */
const localRounds = JSON.parse(localStorage.getItem("tarantes-nuns")) || {
  name: null,
  rounds: [],
};

function saveToLocal() {
  localStorage.setItem("tarantes-nuns", JSON.stringify(localRounds));
}

function resetGame() {
  localRounds.name = null;
  localRounds.rounds = [];

  objSheetRows.innerHTML = "";

  saveToLocal();

  currentRound = 1;

  populateSheetFromStorage();
  toggleModal();

  objButton.removeAttribute("disabled");

  closeGame();
}

function setNunName(name) {
  localRounds.name = name;
  saveToLocal();

  /** Fill nun's image */
  setNumImage(name);

  openGame();
}

function setNumImage(name) {
  document.body.className = name?.toLowerCase();
}

function populateSheetFromStorage() {
  const { name, rounds } = localRounds;

  /** Fill nun's name */
  const nunSelect = document.querySelector(".nun");
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

function addNewRound() {
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
  saveToLocal();

  /** Step 3 - Create new round */
  addRound(++currentRound);
}

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
  optionSS.innerHTML = "SS";
  const optionS = document.createElement("option");
  optionS.innerHTML = "S";
  const optionW = document.createElement("option");
  optionW.innerHTML = "W";
  const optionR = document.createElement("option");
  optionR.innerHTML = "R";
  movementSelect.append(
    document.createElement("option"),
    optionSS,
    optionS,
    optionW,
    optionR
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

populateSheetFromStorage();
