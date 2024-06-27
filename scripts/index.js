function clickCounter () {
  score = score + delta;
  scoreField.textContent = score;
}

btnMain.addEventListener('click', clickCounter);

btnMainScreen.addEventListener('click', () => {
  testField.textContent = btnMainScreen.querySelector('.navigation__btnName').textContent;
});

btnBoosters.addEventListener('click', () => {
  testField.textContent = btnBoosters.querySelector('.navigation__btnName').textContent;
});

btnTasks.addEventListener('click', () => {
  testField.textContent = btnTasks.querySelector('.navigation__btnName').textContent;
});

btnAchievements.addEventListener('click', () => {
  testField.textContent = btnAchievements.querySelector('.navigation__btnName').textContent;
});
// testField.textContent = ``;
nameField.textContent = TMA.initDataUnsafe.user.first_name;
testField.textContent = TMA.initData;
// console.log(TMA);
