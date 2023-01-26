const objForm = document.querySelector(".pure-form .local-rows");
const objButton = document.querySelector(".pure-button");
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
  saveToLocal();

  objForm.innerHTML = `
    <div class="local-row local-title">
      <div class="local-round">#</div>
      <div>Space</div>
      <div>Mvmt</div>
      <div>Event</div>
    </div>
  `;
  currentRound = 1;
  populateSheetFromStorage();
  closeModal();
}

function setNunName(name) {
  localRounds.name = name;
  saveToLocal();
}

function populateSheetFromStorage() {
  const { name, rounds } = localRounds;

  /** Fill nun's name */
  const nunSelect = document.querySelector(".nun");
  nunSelect.value = name;

  /** Add as many rounds exist in the local storage */
  rounds.forEach((round, i) => {
    const newRow = document.createElement("div");
    newRow.className = "local-row";

    const roundDiv = document.createElement("div");
    roundDiv.className = "local-round";
    roundDiv.innerHTML = i + 1;

    const spaceInput = document.createElement("input");
    spaceInput.className = "space";
    spaceInput.setAttribute("type", "number");
    spaceInput.disabled = true;
    spaceInput.value = round.space;

    const optionNone = document.createElement("option");

    const movementSelect = document.createElement("select");
    movementSelect.className = "movement";
    movementSelect.disabled = true;
    const optionSS = document.createElement("option");
    optionSS.innerHTML = "SS";
    const optionS = document.createElement("option");
    optionS.innerHTML = "S";
    const optionW = document.createElement("option");
    optionW.innerHTML = "W";
    const optionR = document.createElement("option");
    optionR.innerHTML = "R";
    movementSelect.append(optionNone, optionSS, optionS, optionW, optionR);
    movementSelect.value = round.mvmt;

    const eventSelect = document.createElement("select");
    eventSelect.className = "event";
    eventSelect.disabled = true;
    const optionK = document.createElement("option");
    optionK.innerHTML = "K";
    const optionSW = document.createElement("option");
    optionSW.innerHTML = "SW";
    eventSelect.append(optionNone, optionK, optionSW);
    eventSelect.value = rounds.evnt;

    newRow.append(roundDiv, spaceInput, movementSelect, eventSelect);
    objForm.append(newRow);
  });

  /** Add a new round */
  currentRound = rounds.length;
  addRound(++currentRound);
}

function addNewRound() {
  console.log(currentRound);
  /** Step 0 - Check valid round */
  const lastRow = document.querySelectorAll(".local-row")[currentRound];
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

function addRound(roundNumber) {
  const newRow = document.createElement("div");
  newRow.className = "local-row";
  newRow.innerHTML = `
    <div class="local-round">${roundNumber}</div>
    <input class="space" type="number" />
    <select class="movement">
      <option value=""></option>
      <option value="SS">SS</option>
      <option value="S">S</option>
      <option value="W">W</option>
      <option value="R">R</option>
    </select>
    <select class="event">
      <option value=""></option>
      <option value="K">K</option>
      <option value="SW">SW</option>
    </select>
  `;

  if (currentRound >= 15) {
    objButton.innerHTML = "No more turns";
    objButton.setAttribute("disabled", true);
  } else {
    objButton.innerHTML = `Start next turn [ ${currentRound + 1} ]`;
    objForm.append(newRow);
  }
}

function openModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

populateSheetFromStorage();
