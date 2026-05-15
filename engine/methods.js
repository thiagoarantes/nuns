export function getFromLocal() {
  return (
    JSON.parse(localStorage.getItem("tarantes-nuns")) || {
      name: null,
      startAt: 0,
      rounds: [],
    }
  );
}

export function saveToLocal(localRounds) {
  localStorage.setItem("tarantes-nuns", JSON.stringify(localRounds));
}

export function setNumImage(name) {
  document.body.className = name?.toLowerCase();
}

export function populateSheetFromStorage(
  localRounds,
  currentRound,
  objButton,
  objSheetRows,
  objSheetEmpty,
  objSheetForm,
) {
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
  addRound(++currentRound, objButton, objSheetRows);

  !!name && openGame(objSheetEmpty, objSheetForm);
}

export function addRound(
  roundNumber,
  objButton,
  objSheetRows,
  _space,
  _movement,
  _event,
) {
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
    objButton.innerHTML = "No more turns";
    objButton.setAttribute("disabled", true);
  } else {
    objButton.innerHTML = `Start next turn [ ${roundNumber + 1} ]`;
  }

  objSheetRows.append(newRow);
}

export function toggleModal(objModal) {
  if (objModal.classList.contains("open")) {
    objModal.classList.remove("open");
    return;
  }

  objModal.classList.add("open");
}

export function openGame(objSheetEmpty, objSheetForm) {
  objSheetEmpty.style.display = "none";
  objSheetForm.style.display = "block";
}

export function closeGame(objSheetEmpty, objSheetForm) {
  objSheetEmpty.style.display = "block";
  objSheetForm.style.display = "none";
}
