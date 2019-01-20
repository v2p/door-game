function onDocumentReady(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function createDoorClickHandler(index) {
  return function () {
    if (selectedDoorIndex !== null) {
      doors[selectedDoorIndex].classList.remove('door--selected');
    }

    selectedDoorIndex = index;

    doors[selectedDoorIndex].classList.add('door--selected');
  };
}

function actionOpenOneBadDoor() {
  var badDoorsIndices = [];

  Array.prototype.forEach.call(doorsData, function (isGoodDoor, i) {
    if (
      !isGoodDoor &&
      openDoors[i] !== true &&
      selectedDoorIndex !== i
    ) {
      badDoorsIndices.push(i);
    }
  });

  var doorIndexToOpen = badDoorsIndices[getRandomInt(0, badDoorsIndices.length)];

  if (typeof doorIndexToOpen !== 'undefined') {
    openDoor(doorIndexToOpen);
  }
}

function actionOpenAll() {
  Array.prototype.forEach.call(doorsData, function (isGoodDoor, i) {
    openDoor(i);
  });
}

function actionReset() {
  regenerateDoors();
  selectedDoorIndex = null;
  openDoors = [];
}

function openDoor(index) {
  var isGoodDoor = doorsData[index];
  var door = doors[index];

  door.innerHTML = isGoodDoor ? '&#x2714;' : '&#x2718;';
  door.classList.add(isGoodDoor ? 'door--good' : 'door--bad');

  openDoors[index] = true;
}

var doorsCount;
var doors = [];
var doorsData = [];
var selectedDoorIndex = null;
var openDoors = [];

function regenerateDoors() {
  doorsCount = parseInt(document.querySelector('[name="doors-count"]').value, 10);

  Array.prototype.forEach.call(doors, function (door) {
    door.remove();
  });

  // create new doors:
  var doorsRow = document.getElementsByClassName('row__doors')[0];

  doorsData = [];
  doors = [];

  for (var i = 0; i < doorsCount; i++) {
    var door = document.createElement('div');
    door.classList.add('cell', 'door');
    door.innerHTML = '?';
    door.addEventListener('click', createDoorClickHandler(i));
    doorsRow.appendChild(door);

    doorsData[i] = false;
    doors[i] = door;
  }

  var goodDoorIndex = getRandomInt(0, doorsCount);
  doorsData[goodDoorIndex] = true;
}

function initActionsRow() {
  var actions = document.getElementsByClassName('actions')[0];
  var actionsOffsetTop = actions.offsetTop;

  window.onscroll = function () {
    if (window.pageYOffset > actionsOffsetTop) {
      actions.classList.add('actions--sticky');
    } else {
      actions.classList.remove('actions--sticky');
    }
  };
}

onDocumentReady(function () {
  regenerateDoors();
  initActionsRow();
});
