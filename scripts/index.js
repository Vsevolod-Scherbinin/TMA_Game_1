function screenSwitcher() {
  if(btnMainScreen.checked) {
    console.log('Main');
    testField.textContent = btnMainScreen.parentElement.querySelector('.navigation__btnName').textContent;
    document.querySelector('.screen_active').classList.remove('screen_active');
    mainScreen.classList.add('screen_active');
  } else if (btnBoosters.checked) {
    console.log('Boosters');
    testField.textContent = btnBoosters.parentElement.querySelector('.navigation__btnName').textContent;
    document.querySelector('.screen_active').classList.remove('screen_active');
    boostersScreen.classList.add('screen_active');
  } else if (btnTasks.checked) {
    console.log('Tasks');
    testField.textContent = btnTasks.parentElement.querySelector('.navigation__btnName').textContent;
    document.querySelector('.screen_active').classList.remove('screen_active');
    tasksScreen.classList.add('screen_active');
  } else if (btnAchievements.checked) {
    console.log('Achieve');
    testField.textContent = btnAchievements.parentElement.querySelector('.navigation__btnName').textContent;
    document.querySelector('.screen_active').classList.remove('screen_active');
    achievementsScreen.classList.add('screen_active');
  }
}
// navSection.addEventListener('click', screenSwitcher);
btnMainScreen.addEventListener('click', screenSwitcher);
btnBoosters.addEventListener('click', screenSwitcher);
btnTasks.addEventListener('click', screenSwitcher);
btnAchievements.addEventListener('click', screenSwitcher);


function clickCounter () {
  score = score + delta;
  scoreField.textContent = score;
}

btnMain.addEventListener('click', clickCounter);

// testField.textContent = ``;
// nameField.textContent = TMA.initDataUnsafe.user.first_name;
// testField.textContent = TMA.initData;
// console.log(TMA);
