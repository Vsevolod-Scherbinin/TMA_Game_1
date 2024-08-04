// ToDo
// CummulativeIncome
// TotalClicks
// Level
  // LevelUps
// PopUps -- TG
  // PassiveOfflineIncome
  // LevelUps
// Unlocking Cards
// Gathering rewards from cards

// Friends!!
// Updating Model Safe!!!

const passiveOfflineIncomeHoursLimit = 3;
const onlinePassiveTimeLimit = 3600 * passiveOfflineIncomeHoursLimit;

function scoreRenderer() {
  scoreField.textContent = userData.score;
}

function passiveIncomeRenderer(income) {
  passiveIncomeScoreField.textContent = `+${income}`;
}

// --------------- Income-Start ---------------
function deltaCounter() {
  const currentDeltaLevel = deltaUpgrade.levels.find(upgrade => upgrade.level === userData.activeUpgrades.find(upgrade => upgrade.id === 1).level);
  const currentDelta = currentDeltaLevel.delta;
  userData.delta = currentDelta;

}

function passiveIncomeCounter() {
  let passiveIncome = 0;
  userData.passiveUpgrades.forEach((item) => {
    const upgradeFromConstant = passiveUpgrades.find(upgrade => upgrade.id === item.id);
    const upgradeFromConstantLevel = upgradeFromConstant.levels.find(upgrade => upgrade.level === item.level);
    passiveIncome = passiveIncome + upgradeFromConstantLevel.income;
  })
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
    const passiveIncome = passiveIncomeCounter();
    userData.score = userData.score + Math.round(passiveIncome / 3600);
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
  if(userData.energy >= userData.delta) {
    userData.energy = userData.energy - userData.delta;
  }
}

let energyRecoveryInterval;
let energyRecoveryTimeout;

function energyRecoveryLooper(start, type) {
  let cycleTime;
  type === 'normal' && (cycleTime = 1000);
  if(type === 'fast') {
    cycleTime = 25;
    btnMain.removeEventListener('click', mainClick);
  }
  if(start) {
    energyRecoveryInterval = setInterval(() => {
      energyRecovery();
      if(userData.energy >= energyLimiter()) {
        clearInterval(energyRecoveryInterval);
        type === 'fast' && btnMain.addEventListener('click', mainClick);
      }
    }, cycleTime);
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

// --------------- User-Start ---------------
const localUserData = JSON.parse(localStorage.getItem('TMAGameUserData'));

function saveUserData() {
  localStorage.setItem('TMAGameUserData', JSON.stringify(userData));
}

function loadUserData() {
  if(localUserData === null) {
    Object.keys(userDataModel).forEach((key) => {
      userData[key] = userDataModel[key];
    })

    activeUpgrades.forEach((upgrade) => {
      userData.activeUpgrades.push({
        id: upgrade.id,
        level: 0,
      });
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

    Object.keys(userDataModel).forEach((key) => {
      userData[key] = localUserData[key];
      userData[key] === undefined && (userData[key] = userDataModel[key]);
      // console.log(userData);
    })
  }
  console.log(userData);
}
// --------------- User-End ---------------

// --------------- Upgrades-Start ---------------
function upgradeFinder(upgradesArray, name) {
  let foundUpgrade;
  if(upgradesArray == 'activeUpgrades') {
    foundUpgrade = activeUpgrades.find(upgrade => upgrade.title === name);
  } else {
    foundUpgrade = passiveUpgrades.find(upgrade => upgrade.title === name);
  };
  const currentUpgrade = {
    id: foundUpgrade.id,
    levels: foundUpgrade.levels,
  }
  console.log(currentUpgrade);

  return currentUpgrade;
}

function upgradePurchase(upgrade) {
  if(userData.score > upgrade.cost) {
    userData.score = userData.score - upgrade.cost;
    scoreRenderer();
    if(upgrade.income !== undefined) {
      console.log('Income');
      userUpgrade.level++;
      const passiveIncome = passiveIncomeCounter();
      passiveIncomeRenderer(passiveIncome);
    } else if (upgrade.delta !== undefined) {
      console.log('Delta');
    } else {
      console.log('Energy');
    }
  }
}

function addUpgrade(evt, upgradesArray) {
  console.log(evt.target);
  const currentUpgradeCard = evt.target.closest('.upgradeCard');
  const currentUpgradeName = currentUpgradeCard.querySelector('.upgradeCard__title').textContent;

  const currentUpgrade = upgradeFinder(upgradesArray, currentUpgradeName);
  console.log('currentUpgrade', currentUpgrade);

  const userUpgrade = userData[upgradesArray][currentUpgrade.id-1];
  const currentUpgradeLevel = currentUpgrade.levels.find(level => level.level === userUpgrade.level+1);
  const nextUpgradeLevel = currentUpgrade.levels.find(level => level.level === currentUpgradeLevel.level+1);
  console.log('currentUpgradeLevel', currentUpgradeLevel);

  // Make function purchase() {}
  if(userData.score > currentUpgradeLevel.cost) {
    userData.score = userData.score - currentUpgradeLevel.cost;
    scoreRenderer();
    if(currentUpgradeLevel.income !== undefined) {
      console.log('Income');
      userUpgrade.level++;
      passiveIncomeRenderer(passiveIncomeCounter());
    } else if (currentUpgradeLevel.delta !== undefined) {
      console.log('Delta');
      userUpgrade.level++;
    } else {
      console.log('Energy');
      userUpgrade.level++;
      energyLimitRenderer();
      // userData.energy = energyLimiter();
      energyRecoveryLooper(true, 'fast');
    }

    console.log('nextUpgradeLevel', nextUpgradeLevel);

    if(nextUpgradeLevel) {
      // userUpgrade.level++;
      currentUpgradeCard.querySelector('.upgradeCard__level').textContent = `lvl ${nextUpgradeLevel.level}`;
      currentUpgradeCard.querySelector('.upgradeCard__cost').textContent = `${nextUpgradeLevel.cost}`;
      if(nextUpgradeLevel.income !== undefined) {
        currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `+${nextUpgradeLevel.income}`;
      } else if(nextUpgradeLevel.delta !== undefined) {
        currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `+${nextUpgradeLevel.delta}`;
      } else {
        currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `+${nextUpgradeLevel.energyLimit}`;
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
      energyRecoveryLooper(true, 'normal');
    }, 1000);

  } else {
    clearTimeout(energyRecoveryTimeout);
  }
}

function mainClick() {
  if(userData.energy > userData.delta) {
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
}

btnMain.addEventListener('click', mainClick);
// --------------- MainClick-End ---------------

// --------------- Window-Start ---------------
window.onload = () => {
  screenSwitcher();
  loadUserData();
  deltaCounter();
  saveUserData();
  scoreRenderer();
  energyRenderer();
  passiveIncomeRenderer(passiveIncomeCounter());
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

  energyRecoveryLooper(true, 'normal');
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
