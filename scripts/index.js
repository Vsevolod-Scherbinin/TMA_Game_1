// ToDo
// Don't use upgrade names. Use ID or number.
// Pull this data to html layout
// Don't save income and energy to userData storage. Find them from constants.
// Load old localStorageUserObject, save vital data and rewrite new object

function scoreRenderer() {
  scoreField.textContent = userData.score;
}

function passiveIncomeRenderer() {
  passiveIncomeScore.textContent = `+${userData.passiveIncome}`;
}

function energyRenderer() {
  energyScoreField.textContent = userData.activeUpgrades.find(upgrade => upgrade.id === 2);
}

// --------------- User-Start ---------------
// const localUserData = JSON.parse(localStorage.getItem('TMAGameUserData'));
const localUserData = JSON.parse(localStorage.getItem('TMAGameUserData1'));

function saveUserData() {
  localStorage.setItem('TMAGameUserData1', JSON.stringify(userData));
}

function userDataLoad() {
  if(localUserData === null) {
    activeUpgrades.forEach((upgrade) => {
      upgrade.id === 2
        ? userData.activeUpgrades.push({
          id: upgrade.id,
          level: 0,
        })
        : userData.activeUpgrades.push({
          id: upgrade.id,
          level: 0,
        })
    })

    passiveUpgrades.forEach((upgrade) => {
      userData.passiveUpgrades.push({
        id: upgrade.id,
        level: 0,
      })
    })
    localStorage.setItem('TMAGameUserData1', JSON.stringify(userData));
    console.log('New User Made');
  } else {
    console.log('Old User');

    Object.keys(userData).forEach((key) => {
      userData[key] = localUserData[key];
    })
    // const userUpgrade = userData.activeUpgrades.find(upgrade => upgrade.id === 2);
    // console.log(activeUpgrades.find(upgrade => upgrade.id === 2).levels.find(level => level.level === userUpgrade.level));
    // userUpgrade.energyLimit = activeUpgrades.find(upgrade => upgrade.id === 2).levels.find(level => level.level === userUpgrade.level).energyLimit;

    // delete userData.activeUpgrades.find(upgrade => upgrade.name === "Energy up").energy;
    // const userUpgradeLevel = userData.activeUpgrades.find(upgrade => upgrade.name === "Energy up").level;
    // console.log(userUpgradeLevel);
    // const effect = activeUpgrades.find(upgrade => upgrade.name === "Energy up").levels.find(upgrade => upgrade.level === userUpgradeLevel).energyLimit;
    // userData.activeUpgrades.find(upgrade => upgrade.name === "Energy up").energyLimit = effect;
    // saveUserData();
  }
  scoreRenderer();
  passiveIncomeRenderer();
  console.log(userData);
}
// --------------- User-End ---------------

// --------------- Energy-Start ---------------

// --------------- Energy-End ---------------

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
// function purchaseUpgrade(obj) {
//   if(score > obj.cost) {

//     console.log('Purchase OK!');
//   } else {

//   }
// }
// --------------- Purchase-End ---------------

// --------------- Upgrades-Start ---------------
function upgradeCardRenderer(card, level) {

}

// Refresh Card Data and Make Passive Income
function addUpgrade(evt, upgradesArray) {
  console.log(evt.target);
  const currentUpgradeCard = evt.target.closest('.upgradeCard');
  const currentUpgradeName = currentUpgradeCard.querySelector('.upgradeCard__name').textContent;

  let foundUpgrade;
  let currentUpgradeId;
  let currentUpgradeLevels;
  if(upgradesArray == 'activeUpgrades') {
    foundUpgrade = activeUpgrades.find(upgrade => upgrade.name === currentUpgradeName);
  } else {
    foundUpgrade = passiveUpgrades.find(upgrade => upgrade.name === currentUpgradeName);
  }
  currentUpgradeId = foundUpgrade.id;
  currentUpgradeLevels = foundUpgrade.levels;

  const userUpgrades = userData[upgradesArray].find(upgrade => upgrade.id === currentUpgradeId);

  const currentUpgrade = currentUpgradeLevels.find(level => level.level === userUpgrades.level+1);
  const nextUpgrade = currentUpgradeLevels.find(level => level.level === currentUpgrade.level+1);
  console.log(currentUpgrade);

  // Refresh Card Data
  // Make function purchase() {}
  if(userData.score > currentUpgrade.cost) {
    userData.score = userData.score - currentUpgrade.cost;
    scoreRenderer();
    userUpgrades.income = currentUpgrade.income;
    userData.passiveIncome = userData.passiveIncome + currentUpgrade.income;
    passiveIncomeRenderer();
    userUpgrades.level++;
    currentUpgradeCard.querySelector('.upgradeCard__level').textContent = `lvl ${nextUpgrade.level}`;
    currentUpgradeCard.querySelector('.upgradeCard__cost').textContent = `${nextUpgrade.cost}`;
    currentUpgradeCard.querySelector('.upgradeCard__income').textContent = `+${nextUpgrade.income}`;
    saveUserData();
  } else {
    console.log('Недостаточно средств');
  }
}

function createUpgradeCard(elem, upgradesArray) {
  const upgradeCardElement = upgradeCardTemplate.cloneNode(true);
  upgradeCardElement.querySelector('.upgradeCard__name').textContent = elem.name;
  const userUpgradesArray = userData[upgradesArray].find(upgrade => upgrade.id === elem.id);

  const currentUpgrade = elem.levels.find(level => level.level === userUpgradesArray.level+1);

  if(userUpgradesArray.level === 0) {
    upgradeCardElement.querySelector('.upgradeCard__level').textContent = `lvl ${elem.levels[0].level}`;
    upgradeCardElement.querySelector('.upgradeCard__cost').textContent = `${elem.levels[0].cost}`;
    upgradeCardElement.querySelector('.upgradeCard__income').textContent = `+${elem.levels[0].income}`;
    // upgradeCardElement.querySelector('.upgradeCard__image').src = elem.url;
  } else {
    upgradeCardElement.querySelector('.upgradeCard__level').textContent = `lvl ${currentUpgrade.level}`;
    upgradeCardElement.querySelector('.upgradeCard__cost').textContent = `${currentUpgrade.cost}`;
    upgradeCardElement.querySelector('.upgradeCard__income').textContent = `+${currentUpgrade.income}`;
  }
  upgradeCardElement.querySelector('.upgradeCard').addEventListener('click', (evt) => {
    addUpgrade(evt, upgradesArray);
  });
  return upgradeCardElement;
};

function test() {
}
// --------------- Upgrades-End ---------------

// --------------- Navigation-Start ---------------
function screenSwitcher() {
  if(btnMainScreen.checked) {
    // console.log('Main');
    document.querySelector('.screen_active').classList.remove('screen_active');
    btnMainScreen.parentElement.querySelector('.navigation__buttonIcon').src = './images/mainscreen-button-icon-active.png';
    btnUpgrades.parentElement.querySelector('.navigation__buttonIcon').src = './images/upgrade-button-icon-inactive.png';
    btnTasks.parentElement.querySelector('.navigation__buttonIcon').src = './images/friends-button-icon-inactive.png';
    btnAchievements.parentElement.querySelector('.navigation__buttonIcon').src = './images/achievements-button-icon-inactive.png';
    mainScreen.classList.add('screen_active');
  } else if (btnUpgrades.checked) {
    // console.log('Upgrades');
    document.querySelector('.screen_active').classList.remove('screen_active');
    btnMainScreen.parentElement.querySelector('.navigation__buttonIcon').src = './images/mainscreen-button-icon-inactive.png';
    btnUpgrades.parentElement.querySelector('.navigation__buttonIcon').src = './images/upgrade-button-icon-active.png';
    btnTasks.parentElement.querySelector('.navigation__buttonIcon').src = './images/friends-button-icon-inactive.png';
    btnAchievements.parentElement.querySelector('.navigation__buttonIcon').src = './images/achievements-button-icon-inactive.png';
    upgradesScreen.classList.add('screen_active');
  } else if (btnTasks.checked) {
    // console.log('Tasks');
    document.querySelector('.screen_active').classList.remove('screen_active');
    btnMainScreen.parentElement.querySelector('.navigation__buttonIcon').src = './images/mainscreen-button-icon-inactive.png';
    btnUpgrades.parentElement.querySelector('.navigation__buttonIcon').src = './images/upgrade-button-icon-inactive.png';
    btnTasks.parentElement.querySelector('.navigation__buttonIcon').src = './images/friends-button-icon-active.png';
    btnAchievements.parentElement.querySelector('.navigation__buttonIcon').src = './images/achievements-button-icon-inactive.png';
    tasksScreen.classList.add('screen_active');
  } else if (btnAchievements.checked) {
    // console.log('Achieve');
    document.querySelector('.screen_active').classList.remove('screen_active');
    btnMainScreen.parentElement.querySelector('.navigation__buttonIcon').src = './images/mainscreen-button-icon-inactive.png';
    btnUpgrades.parentElement.querySelector('.navigation__buttonIcon').src = './images/upgrade-button-icon-inactive.png';
    btnTasks.parentElement.querySelector('.navigation__buttonIcon').src = './images/friends-button-icon-inactive.png';
    btnAchievements.parentElement.querySelector('.navigation__buttonIcon').src = './images/achievements-button-icon-active.png';
    achievementsScreen.classList.add('screen_active');
  }
}

btnMainScreen.addEventListener('click', screenSwitcher);
btnUpgrades.addEventListener('click', screenSwitcher);
btnTasks.addEventListener('click', screenSwitcher);
btnAchievements.addEventListener('click', screenSwitcher);
// --------------- Navigation-End ---------------

function allUpgradesRenderer() {
  activeUpgrades.forEach((elem) => {
    activeUpgradesField.append(createUpgradeCard(elem, 'activeUpgrades'));
  });
  passiveUpgrades.forEach((elem) => {
    passiveUpgradesField.append(createUpgradeCard(elem, 'passiveUpgrades'));
  });
}

window.onload = (event) => {
  console.log("Page is loaded");
  screenSwitcher();
  userDataLoad();
  allUpgradesRenderer();
};

console.log(!window.closed);

// nameField.textContent = TMA.initDataUnsafe.user.first_name;
// console.log(TMA);
