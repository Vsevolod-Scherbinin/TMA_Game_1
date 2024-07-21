function scoreRenderer() {
  scoreField.forEach((item) => {
    item.textContent = userData.score;
  })
}

// --------------- User-Start ---------------
function userDataLoad() {
  const localUserData = JSON.parse(localStorage.getItem('TMAGameUserData'));
  if(localUserData === null) {
    boosters.forEach((booster) => {
      userData.boosters.push({
        name: booster.name,
        level: 0,
        // income: 0
      })
    })
    localStorage.setItem('TMAGameUserData', JSON.stringify(userData));
    console.log('New User Made');
  } else {
    console.log('Old User');

    Object.keys(userData).forEach((key) => {
      userData[key] = localUserData[key];
    })
  }
  scoreRenderer();
  console.log(userData);
}

window.onload = (event) => {
  console.log("Page is loaded");
  userDataLoad();
};

function saveUserData() {
  localStorage.setItem('TMAGameUserData', JSON.stringify(userData));
}
// --------------- User-End ---------------

function clickCounter () {
  userData.score = userData.score + userData.delta;
  scoreRenderer();
  saveUserData();
}

btnMain.addEventListener('click', clickCounter);

// --------------- Purchase-Start ---------------
// function purchaseBooster(obj) {
//   if(score > obj.cost) {

//     console.log('Purchase OK!');
//   } else {

//   }
// }
// --------------- Purchase-End ---------------

// --------------- Boosters-Start ---------------
function boosterFinder(booster, name) {
  return booster.name === name;
}

// Refresh Card Data and Make Passive Income
function addBooster(evt) {
  const currentBoosterCard = evt.target.closest('.boosterCard');
  const currentBoosterName = currentBoosterCard.querySelector('.boosterCard__name').textContent;
  const currentBoosterLevels = boosters.find(booster => booster.name === currentBoosterName).levels;

  const userBooster = userData.boosters.find(booster => booster.name === currentBoosterName)

  const currentBooster = currentBoosterLevels.find(level => level.level === userBooster.level+1);

  // Refresh Card Data
  if(userData.score > currentBooster.cost) {
    userData.score = userData.score - currentBooster.cost;
    scoreRenderer();
    userBooster.income = currentBooster.income;
    userBooster.level++;
    currentBoosterCard.querySelector('.boosterCard__level').textContent = userBooster.level+1;

    saveUserData();
  } else {
    console.log('Недостаточно средств');
  }
  console.log(currentBoosterName);
  console.log(currentBoosterLevels);
  console.log(currentBooster.cost);

  console.log(userBooster.level);




  // const boosterCost = boosters.find(booster => booster.name === currentBoosterName).levels
  // purchase();
}

function createBoosterCard(elem) {
  const boosterCardElement = boosterCardTemplate.cloneNode(true);
  boosterCardElement.querySelector('.boosterCard__name').textContent = elem.name;
  boosterCardElement.querySelector('.boosterCard__level').textContent = `${elem.levels[0].level} lvl`;
  boosterCardElement.querySelector('.boosterCard__cost').textContent = elem.levels[0].cost;
  boosterCardElement.querySelector('.boosterCard__income').textContent = elem.levels[0].income;
  // boosterCardElement.querySelector('.boosterCard__image').src = elem.url;
  boosterCardElement.querySelector('.boosterCard').addEventListener('click', addBooster);

  return boosterCardElement;
};

boosters.forEach((elem) => {
  boostersField.append(createBoosterCard(elem));
});

function test() {
  console.log(boosters.find(boosterFinder));
}

testBtn.addEventListener('click', test);
// --------------- Boosters-End ---------------

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

btnMainScreen.addEventListener('click', screenSwitcher);
btnBoosters.addEventListener('click', screenSwitcher);
btnTasks.addEventListener('click', screenSwitcher);
btnAchievements.addEventListener('click', screenSwitcher);
// --------------- Navigation-End ---------------

// testField.textContent = ``;
// nameField.textContent = TMA.initDataUnsafe.user.first_name;
// testField.textContent = TMA.initData;
// console.log(TMA);
