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

function actionLeaveTwoDoors() {
  var closedBadDoorsIndices = [];
  var badDoorsIndices = [];
  var goodDoorIndex;

  Array.prototype.forEach.call(doorsData, function (isGoodDoor, i) {
    if (isGoodDoor) {
      goodDoorIndex = i;
    }

    if (goodDoorIndex !== i) {
      badDoorsIndices.push(i);

      if (openDoors[i] !== true) {
        closedBadDoorsIndices.push(i);
      }
    }
  });

  var isUserSelectedBadDoor = closedBadDoorsIndices.indexOf(selectedDoorIndex) !== -1;
  var badDoorToLeaveClosed;

  if (isUserSelectedBadDoor) {
    badDoorToLeaveClosed = selectedDoorIndex;
  } else {
    badDoorToLeaveClosed = closedBadDoorsIndices[getRandomInt(0, closedBadDoorsIndices.length)];
  }

  Array.prototype.forEach.call(doorsData, function (isGoodDoor, i) {
    if (i === badDoorToLeaveClosed || i === goodDoorIndex || i === selectedDoorIndex) {
      return;
    }

    openDoor(i);
  });
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
var doorsCountInput = null;
var doors = [];
var doorsData = [];
var selectedDoorIndex = null;
var openDoors = [];

function regenerateDoors() {
  doorsCount = parseInt(doorsCountInput.value, 10);

  if (doorsCount > 1000) {
    return;
  }

  Array.prototype.forEach.call(doors, function (door) {
    door.remove();
  });

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

  doorsCountInput = document.querySelector('[name="doors-count"]');

  var numericKeys = [];
  for (var i = 0; i < 10; i++) {
    numericKeys.push('' + i);
  }

  doorsCountInput.addEventListener('keypress', function (event) {
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    if (event.key === 'Enter') {
      regenerateDoors();
      return;
    }

    if (numericKeys.indexOf(event.key) === -1) {
      event.preventDefault();
    }
  });
}

onDocumentReady(function () {
  initActionsRow();
  regenerateDoors();
});
