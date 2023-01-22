const objForm = document.querySelector(".pure-form .local-rows");
const objButton = document.querySelector(".pure-button");
let currentRound = 1;

function addNewRound() {
  /** Step 0 - Check valid round */
  const lastRow = document.querySelectorAll(".local-row")[currentRound];
  const inputCase = lastRow.querySelector(".case");
  const inputMovement = lastRow.querySelector(".movement");

  if (inputCase.value === "" || inputMovement.value === "") {
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

  /** Step 2 - Create new round */
  const newRow = document.createElement("div");
  newRow.className = "local-row";
  newRow.innerHTML = `
    <div class="local-round">${++currentRound}</div>
    <input class="case" type="number" />
    <select class="movement">
      <option></option>
      <option>Standing Still</option>
      <option>Sneaking</option>
      <option>Walking</option>
      <option>Running</option>
    </select>
    <select>
      <option></option>
      <option>Key</option>
      <option>Secret wish</option>
    </select>
  `;

  if (currentRound === 15) {
    objButton.setAttribute("disabled", true);
  }

  objForm.append(newRow);
}
