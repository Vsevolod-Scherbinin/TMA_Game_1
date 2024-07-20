// --------------- Navigation-Start ---------------
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
// --------------- Navigation-End ---------------


function clickCounter () {
  score = score + delta;
  scoreField.textContent = score;
}

btnMain.addEventListener('click', clickCounter);

function boosterFinder(booster) {
  return booster.name === "Booster 2";
}

// --------------- Boosters-Start ---------------
function createBoosterCard(elem) {
  const boosterCardElement = boosterCardTemplate.cloneNode(true);
  boosterCardElement.querySelector('.boosterCard__name').textContent = elem.name;
  boosterCardElement.querySelector('.boosterCard__level').textContent = `${elem.levels[0].level} lvl`;
  boosterCardElement.querySelector('.boosterCard__cost').textContent = elem.levels[0].cost;
  boosterCardElement.querySelector('.boosterCard__income').textContent = elem.levels[0].income;
  // boosterCardElement.querySelector('.boosterCard__image').src = elem.url;

  return boosterCardElement;
};

boosters.forEach((elem) => {
  boostersField.append(createBoosterCard(elem));
});

function activateBooster() {

}

function test() {
  // console.log(boosters.find(boosterFinder));

}

testBtn.addEventListener('click', test);
// --------------- Boosters-End ---------------


// testField.textContent = ``;
// nameField.textContent = TMA.initDataUnsafe.user.first_name;
// testField.textContent = TMA.initData;
// console.log(TMA);
