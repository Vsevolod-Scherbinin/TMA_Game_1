function scoreRenderer() {
  scoreField.forEach((item) => {
    item.textContent = userData.score;
  })
}

// --------------- User-Start ---------------
const localUserData = JSON.parse(localStorage.getItem('TMAGameUserData'));

function userDataLoad() {
  if(localUserData === null) {

    activeUpgrades.forEach((upgrade) => {
      userData.activeUpgrades.push({
        name: upgrade.name,
        level: 0,
        income: 0
      })
    })

    passiveUpgrades.forEach((upgrade) => {
      userData.passiveUpgrades.push({
        name: upgrade.name,
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
function addUpgrade(evt) {
  const currentUpgradeCard = evt.target.closest('.upgradeCard');
  const currentUpgradeName = currentUpgradeCard.querySelector('.upgradeCard__name').textContent;
  const currentUpgradeLevels = passiveUpgrades.find(upgrade => upgrade.name === currentUpgradeName).levels;

  const userPassiveUpgrades = userData.passiveUpgrades.find(upgrade => upgrade.name === currentUpgradeName);

  const currentUpgrade = currentUpgradeLevels.find(level => level.level === userPassiveUpgrades.level+1);
  const nextUpgrade = currentUpgradeLevels.find(level => level.level === currentUpgrade.level+1);
  console.log(currentUpgrade);

  // Refresh Card Data
  if(userData.score > currentUpgrade.cost) {
    userData.score = userData.score - currentUpgrade.cost;
    scoreRenderer();
    userPassiveUpgrades.income = currentUpgrade.income;
    userData.passiveIncome = userData.passiveIncome + currentUpgrade.income;
    userPassiveUpgrades.level++;
    currentUpgradeCard.querySelector('.upgradeCard__level').textContent = `lvl ${nextUpgrade.level}`;
    currentUpgradeCard.querySelector('.upgradeCard__cost').textContent = `${nextUpgrade.cost}`;
    currentUpgradeCard.querySelector('.upgradeCard__income').textContent = `+${nextUpgrade.income}`;
    saveUserData();
  } else {
    console.log('Недостаточно средств');
  }
}

// function createUpgradeCard(elem) {
//   const upgradeCardElement = upgradeCardTemplate.cloneNode(true);
//   upgradeCardElement.querySelector('.upgradeCard__name').textContent = elem.name;
//   const userPassiveUpgrades = userData.passiveUpgrades.find(upgrade => upgrade.name === elem.name);

//   const currentUpgrade = elem.levels.find(level => level.level === userPassiveUpgrades.level+1);

//   if(userPassiveUpgrades.level === 0) {
//     upgradeCardElement.querySelector('.upgradeCard__level').textContent = `lvl ${elem.levels[0].level} `;
//     upgradeCardElement.querySelector('.upgradeCard__cost').textContent = `Cost ${elem.levels[0].cost}`;
//     upgradeCardElement.querySelector('.upgradeCard__income').textContent = `Income ${elem.levels[0].income}`;
//     // upgradeCardElement.querySelector('.upgradeCard__image').src = elem.url;
//   } else {
//     upgradeCardElement.querySelector('.upgradeCard__level').textContent = `lvl ${currentUpgrade.level} `;
//     upgradeCardElement.querySelector('.upgradeCard__cost').textContent = `Cost ${currentUpgrade.cost}`;
//     upgradeCardElement.querySelector('.upgradeCard__income').textContent = `Income ${currentUpgrade.income}`;
//   }
//   upgradeCardElement.querySelector('.upgradeCard').addEventListener('click', addUpgrade);
//   return upgradeCardElement;
// };

  // if(userPassiveUpgrades === undefined) {
  //   // Add new upgrade to user object

  //   // passiveUpgrades.forEach((upgrade) => {
  //   //   userData.passiveUpgrades.push({
  //   //     name: upgrade.name,
  //   //     level: 0,
  //   //     income: 0
  //   //   })
  //   // })
  // }

function createUpgradeCard(elem, upgradesArray) {
  const upgradeCardElement = upgradeCardTemplate.cloneNode(true);
  upgradeCardElement.querySelector('.upgradeCard__name').textContent = elem.name;
  const userUpgradesArray = userData[upgradesArray].find(upgrade => upgrade.name === elem.name);

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
  upgradeCardElement.querySelector('.upgradeCard').addEventListener('click', addUpgrade);
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

window.onload = (event) => {
  console.log("Page is loaded");
  screenSwitcher();
  userDataLoad();
  activeUpgrades.forEach((elem) => {
    activeUpgradesField.append(createUpgradeCard(elem, 'activeUpgrades'));
  });
  passiveUpgrades.forEach((elem) => {
    passiveUpgradesField.append(createUpgradeCard(elem, 'passiveUpgrades'));
  });

};

console.log(!window.closed);

// nameField.textContent = TMA.initDataUnsafe.user.first_name;
// console.log(TMA);
