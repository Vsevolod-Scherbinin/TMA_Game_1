// const TMA = window.Telegram.WebApp;
const nameField = document.querySelector('.mainScreen__name');
const testField = document.querySelector('.mainScreen__test');
const btnMain = document.querySelector('.mainScreen__button');
const scoreField = document.querySelector('.mainScreen__score');
const navSection = document.querySelector('.navigation');
const btnMainScreen = document.querySelector('.navigation__button_type_mainScreen');
const btnBoosters = document.querySelector('.navigation__button_type_boosters');
const btnTasks = document.querySelector('.navigation__button_type_tasks');
const btnAchievements = document.querySelector('.navigation__button_type_achievement');

// const activeScreen = document.querySelector('.screen_active');
const mainScreen = document.querySelector('.mainScreen');
const boostersScreen = document.querySelector('.boostersScreen');
const tasksScreen = document.querySelector('.tasksScreen');
const achievementsScreen = document.querySelector('.achievementsScreen');

let score = 0;  // make condition of loaded data
let delta = 1;  // make condition of loaded data
