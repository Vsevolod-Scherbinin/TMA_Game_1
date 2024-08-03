// ToDo
// Energy
  // Usage
  // Recovery
// Level
  // LevelUps
// PopUps -- TG
  // PassiveOfflineIncome
  // LevelUps
// Unlocking Cards
// Gathering rewards from cards

const passiveOfflineIncomeHoursLimit = 3;
const onlinePassiveTimeLimit = 3600 * passiveOfflineIncomeHoursLimit;

function scoreRenderer() {
  scoreField.textContent = userData.score;
}

function passiveIncomeRenderer(income) {
  passiveIncomeScoreField.textContent = `+${income}`;
}

// --------------- Income-Start ---------------
function passiveIncomeCounter() {
  let passiveIncome = 0;
  userData.passiveUpgrades.forEach((item) => {
    const upgradeFromConstant = passiveUpgrades.find(upgrade => upgrade.id === item.id);
    const upgradeFromConstantLevel = upgradeFromConstant.levels.find(upgrade => upgrade.level === item.level);
    passiveIncome = passiveIncome + upgradeFromConstantLevel.income;
  })
  console.log(passiveIncome);

  return passiveIncome;
}

function cummulativeIncomeCounter() {
  userData.cummulativeIncome = userData.cummulativeIncome + userData.delta;
  saveUserData();
}

function scoreCounter() {
  userData.score = userData.score + userData.delta;
}

let timer = 0;

function passiveOnlineIncomeCounter() {
  if(timer < onlinePassiveTimeLimit) {
    // console.log(new Date());
    console.log(timer);
    const passiveIncome = passiveIncomeCounter();
    userData.score = userData.score + passiveIncome / 3600;
    scoreRenderer();
    saveUserData();
    timer++;
  }
}

function offlineTimeCounter() {
  const closureDate = localStorage.getItem('closureTime');
  if(closureDate) {
    const now = new Date();
    const closureTime = new Date(closureDate);
    const timeDelta = now - closureTime
    const timeDeltaInSeconds = Math.floor(timeDelta / 1000);
    return timeDeltaInSeconds;
  }
}

function passiveOfflineIncomeCounter(seconds) {
  const limit = 3600 * passiveOfflineIncomeHoursLimit;
  const passiveIncome = passiveIncomeCounter();
  if(seconds < limit) {
    userData.score = userData.score + passiveIncome / 3600 * seconds;
  } else {
    userData.score = userData.score + passiveIncome / 3600 * limit;
  }
  saveUserData();
}
// --------------- Income-End ---------------

// --------------- Energy-Start ---------------
function energyLimiter() {
  const currentEnergyLevel = energyUpgrade.levels.find(upgrade => upgrade.level === userData.activeUpgrades.find(upgrade => upgrade.id === 2).level);
  const currentEnergyLimit = currentEnergyLevel.energyLimit;
  return currentEnergyLimit;
}

function energyLimitRenderer() {
  energyLimitField.textContent = energyLimiter();
}

function energyRenderer() {
  energyScoreField.textContent = userData.energy;
}

function energyCounter() {
  userData.energy = userData.energy - userData.delta;
}

let energyRecoveryInterval;
let energyRecoveryTimeout;

function energyRecoveryLooper(start) {
  if(start) {
    energyRecoveryInterval = setInterval(() => {
      energyRecovery();
      if(userData.energy >= energyLimiter()) {
        clearInterval(energyRecoveryInterval);
      }
    }, 1000);
  } else {
    clearInterval(energyRecoveryInterval);
  }
}

function energyRecovery() {
  if(userData.energy < energyLimiter()) {
    userData.energy = userData.energy + 3;
    if(userData.energy >= energyLimiter()) {
      userData.energy = energyLimiter();
    }
  }
  energyRenderer();
  saveUserData();
}
// --------------- Energy-End ---------------

// --------------- Purchase-Start ---------------
// function purchaseUpgrade(obj) {
//   if(score > obj.cost) {

//     console.log('Purchase OK!');
//   } else {

//   }
// }
// --------------- Purchase-End ---------------

// --------------- User-Start ---------------
// const localUserData = JSON.parse(localStorage.getItem('TMAGameUserData'));
const localUserData = JSON.parse(localStorage.getItem('TMAGameUserData'));

function saveUserData() {
  localStorage.setItem('TMAGameUserData', JSON.stringify(userData));
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
    localStorage.setItem('TMAGameUserData', JSON.stringify(userData));
    console.log('New User Made');
  } else {
    console.log('Old User');

    Object.keys(userData).forEach((key) => {
      userData[key] = localUserData[key];
    })
  }
  userData.passiveUpgrades[0].level = 1;
  scoreRenderer();
  energyRenderer();
  passiveIncomeRenderer(passiveIncomeCounter());
  console.log(userData);
}
// --------------- User-End ---------------

// --------------- Upgrades-Start ---------------

// Refresh Card Data and Make Passive Income
function addUpgrade(evt, upgradesArray) {
  console.log(evt.target);
  const currentUpgradeCard = evt.target.closest('.upgradeCard');
  const currentUpgradeName = currentUpgradeCard.querySelector('.upgradeCard__title').textContent;

  // Define id and levelsArray of current upgrade - Start
  let foundUpgrade;
  let currentUpgradeId;
  let currentUpgradeLevels;
  if(upgradesArray == 'activeUpgrades') {
    foundUpgrade = activeUpgrades.find(upgrade => upgrade.title === currentUpgradeName);
  } else {
    foundUpgrade = passiveUpgrades.find(upgrade => upgrade.title === currentUpgradeName);
  }
  currentUpgradeId = foundUpgrade.id;
  currentUpgradeLevels = foundUpgrade.levels;
  // Define id and levelsArray of current upgrade - End

  // Define upgrade parameters - Start
  const userUpgrade = userData[upgradesArray].find(upgrade => upgrade.id === currentUpgradeId);
  const currentUpgradeLevel = currentUpgradeLevels.find(level => level.level === userUpgrade.level+1);
  const nextUpgrade = currentUpgradeLevels.find(level => level.level === currentUpgradeLevel.level+1);
  console.log(currentUpgradeLevel);
  // Define upgrade parameters - End

  // Make function purchase() {}
  if(userData.score > currentUpgradeLevel.cost) {
    userData.score = userData.score - currentUpgradeLevel.cost;
    scoreRenderer();
    if(currentUpgradeLevel.income !== undefined) {
      console.log('income');
      // Fix counting
      userUpgrade.level++;
      const passiveIncome = passiveIncomeCounter();
      passiveIncomeRenderer(passiveIncome);
    }

    console.log(nextUpgrade);

    if(nextUpgrade) {
      // userUpgrade.level++;
      currentUpgradeCard.querySelector('.upgradeCard__level').textContent = `lvl ${nextUpgrade.level}`;
      currentUpgradeCard.querySelector('.upgradeCard__cost').textContent = `${nextUpgrade.cost}`;
      if(nextUpgrade.income !== undefined) {
        currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `+${nextUpgrade.income}`;
      } else if(nextUpgrade.delta !== undefined) {
        currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `+${nextUpgrade.delta}`;
      } else {
        currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `+${nextUpgrade.energyLimit}`;
        energyLimitRenderer();
      }
    }
    saveUserData();
  } else {
    console.log('Недостаточно средств');
  }
}

function createUpgradeCard(elem, upgradesArray) {
  const upgradeCardElement = upgradeCardTemplate.cloneNode(true);
  upgradeCardElement.querySelector('.upgradeCard__title').textContent = elem.title;
  const userUpgradesArray = userData[upgradesArray].find(upgrade => upgrade.id === elem.id);

  const currentUpgrade = elem.levels.find(level => level.level === userUpgradesArray.level+1);

  if(currentUpgrade) {
    upgradeCardElement.querySelector('.upgradeCard__level').textContent = `lvl ${currentUpgrade.level}`;
    upgradeCardElement.querySelector('.upgradeCard__cost').textContent = `${currentUpgrade.cost}`;

    // upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `+${currentUpgrade.income}`;
    currentUpgrade.income !== undefined
    ? upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `+${currentUpgrade.income}`
    : currentUpgrade.delta !== undefined ? upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `+${currentUpgrade.delta}`
    : upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `${currentUpgrade.energyLimit}`;
  }

  upgradeCardElement.querySelector('.upgradeCard').addEventListener('click', (evt) => {
    addUpgrade(evt, upgradesArray);
  });
  return upgradeCardElement;
};
// --------------- Upgrades-End ---------------

// --------------- WideCards-End ---------------
function createTaskCards(elem) {
  const taskCardElement = wideCardTemplate.cloneNode(true);
  taskCardElement.querySelector('.wideCard__title').textContent = elem.title;
  return taskCardElement;
}

function createWideCards(elem) {
  // function createAchievementCards(elem) {
  const achievementCardElement = wideCardTemplate.cloneNode(true);
  achievementCardElement.querySelector('.wideCard__icon').src = elem.mainIcon;
  achievementCardElement.querySelector('.wideCard__title').textContent = elem.title;
  achievementCardElement.querySelector('.wideCard__description').textContent = elem.description;
  achievementCardElement.querySelector('.wideCard__effectIcon').src = elem.effectIcon;
  achievementCardElement.querySelector('.wideCard__effect').textContent = `+${elem.effect}`;
  return achievementCardElement;
}
// --------------- WideCards-End ---------------

// --------------- Navigation-Start ---------------
function screenSwitcher() {
  if(btnMainScreen.checked) {
    document.querySelector('.screen_active').classList.remove('screen_active');
    document.querySelector('.navigation__btnName_active').classList.remove('navigation__btnName_active');
    btnMainScreen.parentElement.querySelector('.navigation__buttonIcon').src = './images/mainscreen-button-icon-active.png';
    btnUpgrades.parentElement.querySelector('.navigation__buttonIcon').src = './images/upgrade-button-icon-inactive.png';
    btnTasks.parentElement.querySelector('.navigation__buttonIcon').src = './images/friends-button-icon-inactive.png';
    btnAchievements.parentElement.querySelector('.navigation__buttonIcon').src = './images/achievements-button-icon-inactive.png';
    btnMainScreen.parentElement.querySelector('.navigation__btnName').classList.add('navigation__btnName_active');
    mainScreen.classList.add('screen_active');
  } else if (btnUpgrades.checked) {
    document.querySelector('.screen_active').classList.remove('screen_active');
    document.querySelector('.navigation__btnName_active').classList.remove('navigation__btnName_active');
    btnMainScreen.parentElement.querySelector('.navigation__buttonIcon').src = './images/mainscreen-button-icon-inactive.png';
    btnUpgrades.parentElement.querySelector('.navigation__buttonIcon').src = './images/upgrade-button-icon-active.png';
    btnTasks.parentElement.querySelector('.navigation__buttonIcon').src = './images/friends-button-icon-inactive.png';
    btnAchievements.parentElement.querySelector('.navigation__buttonIcon').src = './images/achievements-button-icon-inactive.png';
    btnUpgrades.parentElement.querySelector('.navigation__btnName').classList.add('navigation__btnName_active');
    upgradesScreen.classList.add('screen_active');
  } else if (btnTasks.checked) {
    document.querySelector('.screen_active').classList.remove('screen_active');
    document.querySelector('.navigation__btnName_active').classList.remove('navigation__btnName_active');
    btnMainScreen.parentElement.querySelector('.navigation__buttonIcon').src = './images/mainscreen-button-icon-inactive.png';
    btnUpgrades.parentElement.querySelector('.navigation__buttonIcon').src = './images/upgrade-button-icon-inactive.png';
    btnTasks.parentElement.querySelector('.navigation__buttonIcon').src = './images/friends-button-icon-active.png';
    btnAchievements.parentElement.querySelector('.navigation__buttonIcon').src = './images/achievements-button-icon-inactive.png';
    btnTasks.parentElement.querySelector('.navigation__btnName').classList.add('navigation__btnName_active');
    tasksScreen.classList.add('screen_active');
  } else if (btnAchievements.checked) {
    document.querySelector('.screen_active').classList.remove('screen_active');
    document.querySelector('.navigation__btnName_active').classList.remove('navigation__btnName_active');
    btnMainScreen.parentElement.querySelector('.navigation__buttonIcon').src = './images/mainscreen-button-icon-inactive.png';
    btnUpgrades.parentElement.querySelector('.navigation__buttonIcon').src = './images/upgrade-button-icon-inactive.png';
    btnTasks.parentElement.querySelector('.navigation__buttonIcon').src = './images/friends-button-icon-inactive.png';
    btnAchievements.parentElement.querySelector('.navigation__buttonIcon').src = './images/achievements-button-icon-active.png';
    btnAchievements.parentElement.querySelector('.navigation__btnName').classList.add('navigation__btnName_active');
    achievementsScreen.classList.add('screen_active');
  }
}

btnMainScreen.addEventListener('click', screenSwitcher);
btnUpgrades.addEventListener('click', screenSwitcher);
btnTasks.addEventListener('click', screenSwitcher);
btnAchievements.addEventListener('click', screenSwitcher);
// --------------- Navigation-End ---------------

// --------------- CardsRenderer-Start ---------------
function allUpgradesRenderer() {
  activeUpgrades.forEach((elem) => {
    activeUpgradesField.append(createUpgradeCard(elem, 'activeUpgrades'));
  });
  passiveUpgrades.forEach((elem) => {
    passiveUpgradesField.append(createUpgradeCard(elem, 'passiveUpgrades'));
  });
}

function tasksRenderer() {
  tasks.forEach((elem) => {
    taskCardsField.append(createWideCards(elem));
    // taskCardsField.append(createTaskCards(elem));
  });
}

function achievementsRenderer() {
  achievements.forEach((elem) => {
    achievementCardsField.append(createWideCards(elem));
    // achievementCardsField.append(createAchievementCards(elem));
  });
}

function inviteFriends() {
  const url = 'https://t.me/FirstTGTest_bot';
  const text = 'Привет! Я нашел этот классный канал/бота и хочу, чтобы ты тоже его посмотрел!';

  // Используем Telegram Web Apps API для открытия ссылки
  window.Telegram.WebApp.sendData(JSON.stringify({url: url, text: text}));
  console.log('Invitation');
}
// --------------- CardsRenderer-End ---------------

inviteFriendBtn.addEventListener('click', inviteFriends);

// --------------- MainClick-Start ---------------
function setEnergyRecoveryTimeout(start) {
  if(start) {
    energyRecoveryTimeout = setTimeout(() => {
      energyRecoveryLooper(true);
    }, 1000);

  } else {
    clearTimeout(energyRecoveryTimeout);
  }
}

btnMain.addEventListener('click', () => {
  if(userData.energy > 0) {
    setEnergyRecoveryTimeout(false);
    energyRecoveryLooper(false)
    scoreCounter();
    energyCounter();
    scoreRenderer();
    energyRenderer();
    cummulativeIncomeCounter();
    saveUserData();
  }
  setEnergyRecoveryTimeout(true);
});
// --------------- MainClick-End ---------------

// --------------- Window-Start ---------------
window.onload = () => {
  screenSwitcher();
  userDataLoad();
  passiveOfflineIncomeCounter(offlineTimeCounter());
  passiveOnlineIncomeCounter();
  energyRenderer();
  energyLimiter();
  energyLimitRenderer();
  allUpgradesRenderer();
  tasksRenderer();
  achievementsRenderer();
  console.log(userData);

  let passiveIncomeTimer = setInterval(() => {
    passiveOnlineIncomeCounter();
    if(timer == onlinePassiveTimeLimit) {
      clearInterval(passiveIncomeTimer);
    }
  },  1000);

  energyRecoveryLooper(true);
  // if(window.Telegram.WebApp.initDataUnsafe.user.first_name !== undefined) {
  //   nameField.textContent = window.Telegram.WebApp.initDataUnsafe.user.first_name;
  // }
};

window.addEventListener('beforeunload', (evt) => {
  evt.preventDefault();
  localStorage.setItem('closureTime', new Date());
});
// --------------- Window-End ---------------

// nameField.textContent = TMA.initDataUnsafe.user.first_name;
// console.log(TMA);
