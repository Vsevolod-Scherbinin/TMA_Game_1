function clickCounter () {
  score = score + delta;
  scoreField.textContent = score;
}

btnMain.addEventListener('click', clickCounter);

nameField.textContent = TMA.initDataUnsafe.user.username;
console.log(TMA);
