// const TMA = window.Telegram.WebApp;
const nameField = document.querySelector('.userBar__userName');
const btnMain = document.querySelector('.mainScreen__button');
const scoreField = document.querySelectorAll('.scoreArea__score');
const navSection = document.querySelector('.navigation');
const btnMainScreen = document.querySelector('.navigation__button_type_main');
const btnUpgrades = document.querySelector('.navigation__button_type_upgrades');
const btnTasks = document.querySelector('.navigation__button_type_tasks');
const btnAchievements = document.querySelector('.navigation__button_type_achievement');

// const activeScreen = document.querySelector('.screen_active');
const mainScreen = document.querySelector('.mainScreen');
const upgradesScreen = document.querySelector('.upgradesScreen');
const passiveUpgradesField = document.querySelector('.upgradesScreen__upgradesField_type_passive');
const activeUpgradesField = document.querySelector('.upgradesScreen__upgradesField_type_active')


const tasksScreen = document.querySelector('.tasksScreen');
const achievementsScreen = document.querySelector('.achievementsScreen');

const testBtn = document.querySelector('.test');
const upgradeCardTemplate = document.querySelector('#upgradeCard').content;

const currentUpgrades = [];

// let score = 0;  // make condition of loaded data
// let delta = 1;  // make condition of loaded data
