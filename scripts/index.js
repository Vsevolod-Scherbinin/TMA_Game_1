function scoreRenderer() {
  scoreField.forEach((item) => {
    item.textContent = userData.score;
  })
}

// --------------- User-Start ---------------
const localUserData = JSON.parse(localStorage.getItem('TMAGameUserData'));

function userDataLoad() {
  if(localUserData === null) {
    boosters.forEach((booster) => {
      userData.boosters.push({
        name: booster.name,
        level: 0,
        income: 0
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

function saveUserData() {
  localStorage.setItem('TMAGameUserData', JSON.stringify(userData));
}
// --------------- User-End ---------------

// --------------- Income-Start ---------------
function clickCounter() {
  userData.score = userData.score + userData.delta;
  scoreRenderer();
  saveUserData();
}
btnMain.addEventListener('click', clickCounter);

let timer = 0;

const now = new Date();
console.log(now);

function passiveIncomeCounter() {
  console.log('Try');
  if(timer > 5) {
    // timeCounter();
    return
  }
  userData.score = userData.score + userData.passiveIncome / 60;
  scoreRenderer();
  saveUserData();
  timer++;
  console.log(timer);
}

// let passiveIncomeTimer = setInterval(() => {
//   passiveIncomeCounter();
//   if(timer > 5) {
//     clearInterval(passiveIncomeTimer);
//   }
// },  1000);

// function timeCounter() {
//   if(timer > 5) {
//     clearInterval(passiveIncomeTimer);
//   }
// }
// if(timer > 5) {
//   clearInterval(passiveIncomeTimer);
// }
// --------------- Income-End ---------------


// --------------- Purchase-Start ---------------
// function purchaseBooster(obj) {
//   if(score > obj.cost) {

//     console.log('Purchase OK!');
//   } else {

//   }
// }
// --------------- Purchase-End ---------------

// --------------- Boosters-Start ---------------
function boosterCardRenderer(card, level) {

}

// Refresh Card Data and Make Passive Income
function addBooster(evt) {
  const currentBoosterCard = evt.target.closest('.boosterCard');
  const currentBoosterName = currentBoosterCard.querySelector('.boosterCard__name').textContent;
  const currentBoosterLevels = boosters.find(booster => booster.name === currentBoosterName).levels;

  const userBooster = userData.boosters.find(booster => booster.name === currentBoosterName);

  const currentBooster = currentBoosterLevels.find(level => level.level === userBooster.level+1);
  const nextBooster = currentBoosterLevels.find(level => level.level === currentBooster.level+1);
  console.log(currentBooster);

  // Refresh Card Data
  if(userData.score > currentBooster.cost) {
    userData.score = userData.score - currentBooster.cost;
    scoreRenderer();
    userBooster.income = currentBooster.income;
    userData.passiveIncome = userData.passiveIncome + currentBooster.income;
    userBooster.level++;
    currentBoosterCard.querySelector('.boosterCard__level').textContent = `${nextBooster.level} lvl`;
    currentBoosterCard.querySelector('.boosterCard__cost').textContent = `Cost ${nextBooster.cost}`;
    currentBoosterCard.querySelector('.boosterCard__income').textContent = `Income ${nextBooster.income}`;
    saveUserData();
  } else {
    console.log('Недостаточно средств');
  }
}

function createBoosterCard(elem) {
  const boosterCardElement = boosterCardTemplate.cloneNode(true);
  boosterCardElement.querySelector('.boosterCard__name').textContent = elem.name;

  const userBooster = userData.boosters.find(booster => booster.name === elem.name);
  const currentBooster = elem.levels.find(level => level.level === userBooster.level+1);

  if(userBooster.level === 0) {
    boosterCardElement.querySelector('.boosterCard__level').textContent = `${elem.levels[0].level} lvl`;
    boosterCardElement.querySelector('.boosterCard__cost').textContent = `Cost ${elem.levels[0].cost}`;
    boosterCardElement.querySelector('.boosterCard__income').textContent = `Income ${elem.levels[0].income}`;
    // boosterCardElement.querySelector('.boosterCard__image').src = elem.url;
  } else {
    boosterCardElement.querySelector('.boosterCard__level').textContent = `${currentBooster.level} lvl`;
    boosterCardElement.querySelector('.boosterCard__cost').textContent = `Cost ${currentBooster.cost}`;
    boosterCardElement.querySelector('.boosterCard__income').textContent = `Income ${currentBooster.income}`;
  }


  boosterCardElement.querySelector('.boosterCard').addEventListener('click', addBooster);

  return boosterCardElement;
};

function test() {
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

window.onload = (event) => {
  console.log("Page is loaded");
  userDataLoad();
  boosters.forEach((elem) => {
    boostersField.append(createBoosterCard(elem));
  });
};

console.log(!window.closed);

// testField.textContent = ``;
// nameField.textContent = TMA.initDataUnsafe.user.first_name;
// testField.textContent = TMA.initData;
// console.log(TMA);
