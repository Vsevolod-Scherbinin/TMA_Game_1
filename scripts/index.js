// ToDo

// Later
// Friends!!
// Updating Model Safe!!!
// DataBase??

const removeAttributes = (element) => {
  while (element.attributes.length > 0) {
      element.removeAttribute(element.attributes[0].name);
  }
};

function achievementGathering(obj, level) {
  // console.log(obj);

  const newAchievement = {
    id: obj.id,
    level: level,
  };
  // console.log('newAchievement', newAchievement);

  const isObjectPresent = userData.gatheredAchievements.some(obj => obj.id === newAchievement.id);
  // console.log(isObjectPresent);

  if(isObjectPresent) {
    const gatheredAchievement = userData.gatheredAchievements.find(obj => obj.id === newAchievement.id);
    // console.log('gatheredAchievement', gatheredAchievement);

    if(gatheredAchievement.level < newAchievement.level) {
      userData.gatheredAchievements.splice(userData.gatheredAchievements.indexOf(gatheredAchievement), 1);
      userData.gatheredAchievements.push(newAchievement);
    }
  } else {
    userData.gatheredAchievements.push(newAchievement);
  }
}

// --------------- Popup-Start ---------------
function popupClose() {
  popup.classList.add('popup_inactive');
}

function cardReplacer() {
  const cards = document.querySelectorAll('.wideCard_type_achievement');
  cards.forEach((card) => {
    card.replaceWith(card.cloneNode(true));
  });
}

function popupOpen(obj, level) {
  const objLevel = obj.levels.find(obj => obj.level === level);
  popup.classList.remove('popup_inactive');
  popup.querySelector('.popup__title').textContent = obj.title;
  popup.querySelector('.popup__message').textContent = `${objLevel.description} и получите $${formatNumberWithSpaces(objLevel.effect)}`;
  popup.querySelector('.popup__image').src = objLevel.mainIcon;
  console.log(objLevel.effect);
  const card = document.querySelector(`.wideCard_id_${obj.id}`);
  const submit = () => {
    achievementGathering(obj, level);
    obj.metric === 'energyLimit'
      ? userData.energyLimit = userData.energyLimit + objLevel.effect
      : userData.score = userData.score + objLevel.effect;
    cardReplacer();
    achievementsLevelCheck();
    scoreRenderer();
    popupClose();
  }
  popup.querySelector('.popup__button').addEventListener('click', submit, { once: true });
}
// --------------- Popup-End ---------------

// --------------- Renderers-Start ---------------
const formatNumberWithSpaces = (number) => {
  return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true,
  }).format(number).replace(/,/g, ' ');
};

function scoreRenderer() {
  scoreField.textContent = formatNumberWithSpaces(userData.score);

}

function passiveIncomeRenderer() {
  passiveIncomeScoreField.textContent = `+${formatNumberWithSpaces(userData.passiveIncome)}`;
}

function achievementsCardsRenderer() {
  // console.log('achievements', userData.achievements[0]);

  achievements.forEach((elem) => {
    if(elem.id !== 5) {
      const userLevel = userData.achievements.find(obj => obj.id === elem.id).level;
      const card = createAchievementsCard(elem, userLevel);
      achievementCardsField.append(card);
    }
  });
}

function achievementsContentRenderer() {
  const cards = document.querySelectorAll('.wideCard__title');

  cards.forEach((card) => {
    // console.log(card);

    const cardObj = achievements.find(obj => obj.title === card.textContent);
    if(cardObj) {
      const userAchLevel = userData.achievements.find(obj => obj.id === cardObj.id).level;
      const cardLevel = cardObj.levels.find(obj => obj.level === userAchLevel);
      card.closest('.wideCard').querySelector('.wideCard__icon').src = cardLevel.mainIcon;
      card.closest('.wideCard').querySelector('.wideCard__description').textContent = cardLevel.description;
      card.closest('.wideCard').querySelector('.wideCard__effect').textContent = formatNumberWithSpaces(cardLevel.effect);
    }
  });

  userData.achievements.forEach((userAch) => {
      const found = achievements.find(obj => obj.id === userAch);
  });
}
// --------------- Renderers-End ---------------

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
    // console.log(upgradeFromConstantLevel.income);

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
    userData.cummulativeIncome = userData.cummulativeIncome + Math.round(passiveIncome / 3600);

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

// function passiveOfflineIncomeCounter(seconds) {
//   const limit = 3600 * passiveOfflineIncomeHoursLimit;
//   const passiveIncome = passiveIncomeCounter();
//   if(seconds < limit) {
//     userData.score = userData.score + Math.round(passiveIncome / 3600) * seconds;
//     userData.cummulativeIncome = userData.cummulativeIncome + Math.round(passiveIncome / 3600) * seconds;
//   } else {
//     userData.score = userData.score + Math.round(passiveIncome / 3600) * limit;
//     userData.cummulativeIncome = userData.cummulativeIncome + Math.round(passiveIncome / 3600) * limit;
//   }

//   saveUserData();
// }

function passiveOfflineIncomeCounter(seconds) {
  const limit = 3600 * passiveOfflineIncomeHoursLimit;
  const passiveIncome = passiveIncomeCounter();
  if(seconds < limit) {
    return Math.round(passiveIncome / 3600) * seconds;
  } else {
    return Math.round(passiveIncome / 3600) * limit;
  }
}

// --------------- Income-End ---------------

// --------------- Energy-Start ---------------
function energyUpgradeLimiter() {
  const currentEnergyLevel = energyUpgrade.levels.find(upgrade => upgrade.level === userData.activeUpgrades.find(upgrade => upgrade.id === 2).level);
  const currentEnergyLimit = currentEnergyLevel.energyLimit;
  return currentEnergyLimit;
}

function energyAchievementLimiter() {
  const energyAchievement = achievements.find(obj => obj.id === 5);
  const userAchGathered = userData.gatheredAchievements.find(obj => obj.id === energyAchievement.id);
  if(userAchGathered) {
    const currentEnergyAchievementLimit = energyAchievement.levels.find(obj => obj.level = userAchGathered.level).effect;
    console.log(currentEnergyAchievementLimit);
    return currentEnergyAchievementLimit;
  }
}

function energyLimiterTotal() {
  let total;
  // energyAchievementLimiter()
  //   ? total = energyUpgradeLimiter() + energyAchievementLimiter()
    // : total = energyUpgradeLimiter();
    total = energyUpgradeLimiter();
  return total;
}


function energyLimitRenderer() {
  energyLimitField.textContent = formatNumberWithSpaces(energyLimiterTotal());
}

function energyRenderer() {
  energyScoreField.textContent = formatNumberWithSpaces(userData.energy);
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
      if(userData.energy >= energyUpgradeLimiter()) {
        clearInterval(energyRecoveryInterval);
        type === 'fast' && btnMain.addEventListener('click', mainClick);
      }
    }, cycleTime);
  } else {
    clearInterval(energyRecoveryInterval);
  }
}

function energyRecovery() {
  if(userData.energy < energyUpgradeLimiter()) {
    userData.energy = userData.energy + 3;
    if(userData.energy >= energyUpgradeLimiter()) {
      userData.energy = energyUpgradeLimiter();
    }
  }
  energyRenderer();
  saveUserData();
}

// --------------- Energy-End ---------------

// --------------- Level-Start ---------------
function levelRenderer() {
  levelField.textContent = `${formatNumberWithSpaces(userData.level)}`;
}

function progressBarRenderer(prevLimit, currentLimit) {
  if(userData.cummulativeIncome > 0) {
    if(userData.level === 1) {
      prevLimit = 0;
    }
    const progress = (userData.cummulativeIncome - prevLimit) / (currentLimit - prevLimit) * 100;
    progressBar.style.width = `${progress}%`;
  } else {
    progressBar.style.width = `0%`;
  }

}

const a = 30;
const c = 70;
function levelLimitCounter(level) {
  const levelLimit = a * Math.pow(level, 2) + c;
  return levelLimit;
}

// function levelRewarder(prevLevel, currentLevel) {
//   const levelDelta = currentLevel - prevLevel;
//   const rewardMultiplier = 10;
//   let reward;
//   for(i=prevLevel; i<currentLevel; i++) {
//     // console.log(i);

//     reward = reward + (i+1)*rewardMultiplier;
//   }
//   // console.log('reward', reward);
// }

function levelProgressCounter() {
  // const prevLevel = userData.level;
  // console.log('prevLevel', prevLevel);
  userData.level = Math.floor(Math.sqrt((userData.cummulativeIncome - c) / a)) + 1 || 1;
  // levelRewarder(prevLevel, userData.level);
  const prevLimit = levelLimitCounter(userData.level-1);
  const currentLimit = levelLimitCounter(userData.level);

  // (userData.cummulativeIncome >= currentLimit) && userData.level++;
  progressBarRenderer(prevLimit, currentLimit);
  levelRenderer();
}
// --------------- Level-End ---------------

// --------------- Achievements-Start ---------------
function achievementsLevelCheck() {
  // energyAchievementLimiter();
  achievements.forEach((object) => {
    const isGathered = userData.gatheredAchievements.some(obj => obj.id === object.id);

    // console.log(energyLimiterTotal());

    let lessArray;

    object.metric === 'energyLimit'
      ? lessArray = object.levels.filter(obj => obj.limit <= energyLimiterTotal())
      : lessArray = object.levels.filter(obj => obj.limit <= userData[object.metric]);
    const lessLimits = [];
    lessArray.forEach((obj) => {
      lessLimits.push(obj.limit);
    });
    const userAch = userData.achievements.find(obj => obj.id === object.id);
    const card = document.querySelector(`.wideCard_id_${object.id}`);
    const handlePopupOpen = () => {
      popupOpen(object, userAch.level);
    }
    if(lessArray.length) {
      if(!isGathered) {
        userAch.level = 1;
        card.addEventListener('click', handlePopupOpen);
      } else {
        const gatheredLevel = userData.gatheredAchievements.find(obj => obj.id === object.id).level;
        const availableLevel = lessArray.find(obj => obj.limit === Math.max(...lessLimits)).level + 1;
        userAch.level = gatheredLevel;
        if(gatheredLevel < availableLevel) {
          userAch.level = gatheredLevel + 1;
          card.addEventListener('click', handlePopupOpen);
        }
      }
    } else {
      userAch.level = 0;
    }
  });
};


// --------------- Achievements-End ---------------

// --------------- User-Start ---------------
const localUserData = JSON.parse(localStorage.getItem('TMAGameUserData'));
// const localUserData = null;
// localStorage.clear();

function saveUserData() {
  localStorage.setItem('TMAGameUserData', JSON.stringify(userData));
}

function loadUserData() {
  if(localUserData === null) {
    console.log('New User');

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
      const isUpgradePresent = userData.passiveUpgrades.some(obj => obj.id === upgrade.id);
      !isUpgradePresent && userData.passiveUpgrades.push({
        id: upgrade.id,
        level: 0,
      })
    })

    achievements.forEach((achievement) => {
      userData.achievements.push({
        id: achievement.id,
        level: 0,
      })
    })

    localStorage.setItem('TMAGameUserData', JSON.stringify(userData));
    // console.log('New User Made');
  } else {
    console.log('Old User');

    Object.keys(userDataModel).forEach((key) => {
      // userData[key] = userDataModel[key]; // Для обнуления пользователя
      userData[key] = localUserData[key];
      userData[key] === undefined && (userData[key] = userDataModel[key]);
      // console.log(userData);
    })
    // userData Additions-Start

    // achievements.forEach((achievement) => {
    //   userData.achievements.push({
    //     id: achievement.id,
    //     level: 0,
    //   })
    // })

    // userData Additions-End

  }
  console.log(userData);
}
// --------------- User-End ---------------

// --------------- Upgrades-Start ---------------
function checkUpgradeAvailable() {
  const upgradeCards = document.querySelectorAll('.upgradeCard');
  upgradeCards.forEach((card) => {
    const costArea = card.querySelector('.upgradeCard__cost');
    const overlay = card.querySelector('.upgradeCard__overlay');
    if(costArea) {
      const cost = card.querySelector('.upgradeCard__cost').textContent;
      userData.score < cost
        ? overlay.classList.add('upgradeCard__overlay_inactive')
        : overlay.classList.remove('upgradeCard__overlay_inactive');
    }
  });
}

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
  // console.log(currentUpgrade);

  return currentUpgrade;
}

function addUpgrade(evt, upgradesArray) {
  // console.log(evt.target);
  const currentUpgradeCard = evt.target.closest('.upgradeCard');
  const currentUpgradeName = currentUpgradeCard.querySelector('.upgradeCard__title').textContent;

  const currentUpgrade = upgradeFinder(upgradesArray, currentUpgradeName);
  // console.log('currentUpgrade', currentUpgrade);

  const userUpgrade = userData[upgradesArray][currentUpgrade.id-1];
  const currentUpgradeLevel = currentUpgrade.levels.find(level => level.level === userUpgrade.level+1);

  let nextUpgradeLevel;
  (currentUpgradeLevel) && (nextUpgradeLevel = currentUpgrade.levels.find(level => level.level === currentUpgradeLevel.level+1));
  // console.log('currentUpgradeLevel', currentUpgradeLevel);

  // Make function purchase() {}
  if(currentUpgradeLevel) {
    if(userData.score >= currentUpgradeLevel.cost) {
      userData.score = userData.score - currentUpgradeLevel.cost;
      userData.expences = userData.expences + currentUpgradeLevel.cost;
      scoreRenderer();
      if(currentUpgradeLevel.income !== undefined) {
        // console.log('Income');
        userUpgrade.level++;
        userData.passiveIncome = passiveIncomeCounter();
        passiveIncomeRenderer();
      } else if (currentUpgradeLevel.delta !== undefined) {
        // console.log('Delta');
        userUpgrade.level++;
        deltaCounter();
      } else {
        // console.log('Energy');
        userUpgrade.level++;
        energyLimitRenderer();
        // userData.energy = energyUpgradeLimiter();
        energyRecoveryLooper(true, 'fast');
      }

      // console.log('nextUpgradeLevel', nextUpgradeLevel);

      if(nextUpgradeLevel) {
        // userUpgrade.level++;
        currentUpgradeCard.querySelector('.upgradeCard__level').textContent = `lvl ${nextUpgradeLevel.level}`;
        currentUpgradeCard.querySelector('.upgradeCard__cost').textContent = `${formatNumberWithSpaces(nextUpgradeLevel.cost)}`;
        if(nextUpgradeLevel.income !== undefined) {
          currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `+${formatNumberWithSpaces(nextUpgradeLevel.income)}`;
        } else if(nextUpgradeLevel.delta !== undefined) {
          currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `+${formatNumberWithSpaces(nextUpgradeLevel.delta)}`;
        } else {
          currentUpgradeCard.querySelector('.upgradeCard__effect').textContent = `+${formatNumberWithSpaces(nextUpgradeLevel.energyLimit)}`;
        }
      } else {
        currentUpgradeCard.querySelector('.upgradeCard__level').textContent = `lvl Max`;
        currentUpgradeCard.querySelector('.upgradeCard__costArea').remove();

        // style
        currentUpgradeCard.classList.add('.upgradeCard_inactive');
        currentUpgradeCard.removeEventListener('click', (evt) => {
          addUpgrade(evt, upgradesArray);
        });
      }
      saveUserData();
    } else {
      // console.log('Недостаточно средств');
    }
  }
}

function createUpgradeCard(elem, upgradesArray) {
  const upgradeCardElement = upgradeCardTemplate.cloneNode(true);
  upgradeCardElement.querySelector('.upgradeCard__title').textContent = elem.title;
  upgradeCardElement.querySelector('.upgradeCard__icon').src = elem.mainIcon;
  upgradeCardElement.querySelector('.upgradeCard__effectIcon').src = elem.effectIcon;
  const userUpgradesArray = userData[upgradesArray].find(upgrade => upgrade.id === elem.id);

  const currentUpgrade = elem.levels.find(level => level.level === userUpgradesArray.level+1);
  const previousUpgrade = elem.levels.find(level => level.level === userUpgradesArray.level);

  if(currentUpgrade) {
    upgradeCardElement.querySelector('.upgradeCard').addEventListener('click', (evt) => {
      addUpgrade(evt, upgradesArray);
    });

    upgradeCardElement.querySelector('.upgradeCard__level').textContent = `lvl ${currentUpgrade.level}`;
    upgradeCardElement.querySelector('.upgradeCard__cost').textContent = `${formatNumberWithSpaces(currentUpgrade.cost)}`;

    currentUpgrade.income !== undefined
      ? upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `+${formatNumberWithSpaces(currentUpgrade.income)}`
      : currentUpgrade.delta !== undefined
        ? upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `+${formatNumberWithSpaces(currentUpgrade.delta)}`
        : upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `${formatNumberWithSpaces(currentUpgrade.energyLimit)}`;
  } else {
    upgradeCardElement.querySelector('.upgradeCard__level').textContent = `lvl Max`;
    upgradeCardElement.querySelector('.upgradeCard__costArea').remove();

    previousUpgrade.income !== undefined
      ? upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `+${formatNumberWithSpaces(previousUpgrade.income)}`
      : previousUpgrade.delta !== undefined
        ? upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `+${formatNumberWithSpaces(previousUpgrade.delta)}`
        : upgradeCardElement.querySelector('.upgradeCard__effect').textContent = `${formatNumberWithSpaces(previousUpgrade.energyLimit)}`;
  }


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
  const wideCardElement = wideCardTemplate.cloneNode(true);
  wideCardElement.querySelector('.wideCard__icon').src = elem.mainIcon;
  wideCardElement.querySelector('.wideCard__title').textContent = elem.title;
  wideCardElement.querySelector('.wideCard__description').textContent = elem.description;
  wideCardElement.querySelector('.wideCard__effectIcon').src = elem.effectIcon;
  wideCardElement.querySelector('.wideCard__effect').textContent = `+${formatNumberWithSpaces(elem.effect)}`;
  return wideCardElement;
}

function createAchievementsCard(elem, level) {
  const levelData = elem.levels.find(obj => obj.level === level);
  const achievementCardElement = wideCardTemplate.cloneNode(true);
  achievementCardElement.querySelector('.wideCard').classList.add(`wideCard_type_achievement`);
  achievementCardElement.querySelector('.wideCard').classList.add(`wideCard_id_${elem.id}`);
  achievementCardElement.querySelector('.wideCard__icon').src = levelData.mainIcon;
  achievementCardElement.querySelector('.wideCard__title').textContent = elem.title;
  achievementCardElement.querySelector('.wideCard__description').textContent = levelData.description;
  achievementCardElement.querySelector('.wideCard__effectIcon').src = elem.effectIcon;
  achievementCardElement.querySelector('.wideCard__effect').textContent = `+${formatNumberWithSpaces(levelData.effect)}`;
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
    // Review if next function is needed.
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

function inviteFriends() {
  const url = 'https://t.me/FirstTGTest_bot';
  const text = 'Привет! Я нашел этот классный канал/бота и хочу, чтобы ты тоже его посмотрел!';

  // Используем Telegram Web Apps API для открытия ссылки
  window.Telegram.WebApp.sendData(JSON.stringify({url: url, text: text}));
  // console.log('Invitation');
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
    userData.taps++;
    userData.activeIncome = userData.activeIncome + userData.delta;
    setEnergyRecoveryTimeout(false);
    energyRecoveryLooper(false)
    scoreCounter();
    scoreRenderer();
    levelProgressCounter();
    energyCounter();
    energyRenderer();
    cummulativeIncomeCounter();
    checkUpgradeAvailable();
    // achievementsCheckTaps();
    achievementsContentRenderer();
    // console.log('taps', userData.taps);
    saveUserData();
  }
  setEnergyRecoveryTimeout(true);
}

btnMain.addEventListener('click', mainClick);
// --------------- MainClick-End ---------------

// --------------- ServiceFunctions-Start ---------------

function totalExpencesCounter() {
  let activeExpences = 0;
  let passiveExpences = 0;
  // console.log(userData.activeUpgrades);

  userData.activeUpgrades.forEach((upgrade) => {
    // console.log('upgrade.level', upgrade.level);

    for(i = 1; i <= upgrade.level; i++) {
      activeExpences = activeExpences + activeUpgrades[upgrade.id - 1].levels[i].cost;
    };
  })
  // console.log('activeExpences', activeExpences);

  userData.passiveUpgrades.forEach((upgrade) => {
    // console.log('upgrade.level', upgrade.level);

    for(i = 1; i <= upgrade.level; i++) {
      passiveExpences = passiveExpences + passiveUpgrades[upgrade.id - 1].levels[i].cost;
    };
  })
  // console.log('passiveExpences', passiveExpences);

  const totalExpences = activeExpences + passiveExpences;
  // console.log('totalExpences', totalExpences);
  userData.expences = totalExpences;
}

// --------------- ServiceFunctions-End ---------------


// --------------- Window-Start ---------------
function offlineIncomePopupOpen(offlinePassiveIncome) {
  popup.classList.remove('popup_inactive');
  popup.querySelector('.popup__title').textContent = 'Ваш заработок!';
  popup.querySelector('.popup__message').textContent = `Поздравляем! Вы заработали $${formatNumberWithSpaces(offlinePassiveIncome)}`;
  popup.querySelector('.popup__image').src = './images/offline-passive-income-icon.png';
  const submit = () => {
    userData.score = userData.score + offlinePassiveIncome;
    userData.cummulativeIncome = userData.cummulativeIncome + offlinePassiveIncome;
    saveUserData();
    scoreRenderer();
    popupClose();
  }
  popup.querySelector('.popup__button').addEventListener('click', submit, { once: true });
}

window.onload = () => {
  loadUserData();
  // ServiceFunctions-Start
    // totalExpencesCounter();
    // userData.score = 60000000;
    // userData.gatheredAchievements = [];
    // userData.achievements[4].level = 0;
    saveUserData();
  // ServiceFunctions-End
  const offlinePassiveIncome = passiveOfflineIncomeCounter(offlineTimeCounter());
  offlinePassiveIncome > 0 && offlineIncomePopupOpen(passiveOfflineIncomeCounter(offlineTimeCounter()));
  screenSwitcher();
  checkUpgradeAvailable();
  levelRenderer();
  levelProgressCounter();
  deltaCounter();
  saveUserData();
  scoreRenderer();
  energyRenderer();
  passiveIncomeCounter();
  passiveIncomeRenderer();
  // passiveOfflineIncomeCounter(offlineTimeCounter());
  passiveOnlineIncomeCounter();
  energyRenderer();
  energyUpgradeLimiter();
  energyLimitRenderer();
  allUpgradesRenderer();
  tasksRenderer();
  saveUserData();
  achievementsCardsRenderer();
  // attributeSetter();
  achievementsLevelCheck();
  achievementsContentRenderer();

  // Make separate function as energy
  let passiveIncomeTimer = setInterval(() => {
    // Move unlimited functions to userOnlineTimer
    passiveOnlineIncomeCounter();
    levelProgressCounter();
    scoreRenderer();
    checkUpgradeAvailable();
    // achievementsLevelCheck();
    achievementsContentRenderer();

    saveUserData();

    if(timer == onlinePassiveTimeLimit) {
      clearInterval(passiveIncomeTimer);
    }
  },  1000);

  let userOnlineTimer = setInterval(() => {
    userData.timeOnline++;
    saveUserData();
  },  1000);

  energyRecoveryLooper(true, 'normal');
  if(window.Telegram.WebApp.initDataUnsafe.user.first_name !== undefined) {
    nameField.textContent = window.Telegram.WebApp.initDataUnsafe.user.first_name;
  }
};

window.addEventListener('beforeunload', (evt) => {
  evt.preventDefault();
  localStorage.setItem('closureTime', new Date());
});
// --------------- Window-End ---------------

// nameField.textContent = TMA.initDataUnsafe.user.first_name;
// console.log(TMA);
