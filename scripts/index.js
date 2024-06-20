function clickCounter () {
  score = score + delta;
  scoreField.textContent = score;
}

btnMain.addEventListener('click', clickCounter);

nameField.textContent = TMA.initDataUnsafe.user.first_name;
testField.textContent = TMA.initData;
console.log(TMA);
