export function saveToLocal(localRounds) {
  localStorage.setItem("tarantes-nuns", JSON.stringify(localRounds));
}

export function setNumImage(name) {
  document.body.className = name?.toLowerCase();
}

export function populateSheetFromStorage(localRounds, currentRound) {
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
