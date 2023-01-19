const gameField = document.getElementById('field');
const context = gameField.getContext('2d');
const player = new Image();
player.src = 'media/tank.png';
player.width = 60;
player.height = 50;
let score = 0;
const tank1Property = {
  tankSpeed: 30,
  id: 'player',
  life: true,
  damageSpeed: 500,
  bullSpeed: 5,
  damage: 1,
};

let bullArr = [];
const playerPosX = 510;
let step;
let tankSpeed = tank1Property.tankSpeed;
let damageSpeed = tank1Property.damageSpeed;
let bullSpeed = tank1Property.bullSpeed;

let playerY = 0;
//

// game
function drawTick() {
  context.clearRect(0, 0, gameField.width, gameField.height);
  context.drawImage(player, playerPosX, playerY, player.width, player.height);

  bullUpdate();
  enUpdate();
  bulletCheck();
}
//

let gameTick = setInterval(drawTick, 30);
let bullShot = setInterval(() => {
  // console.log('bullShot Y=', playerY);
  shot(playerY);
}, damageSpeed);

//player

document.addEventListener('keydown', function (e) {
  // console.log(e.key);
  switch (e.key) {
    case 'ArrowUp':
      step = -tankSpeed;
      break;
    case 'ArrowDown':
      step = tankSpeed;
      break;
    case 'w':
      // console.log('pisun');
      step = -tankSpeed;
      break;
    case 's':
      step = +tankSpeed;
      break;
  }
  // console.log('!Y', playerY);
  if (playerY < 0) {
    playerY = 0;
    return;
  }
  if (playerY > gameField.height) {
    playerY = gameField.height;
    return;
  }

  playerY += step;
});

function bullUpdate() {
  if (bullArr.length < 1) return;
  // console.log(bullArr);
  for (let i = 0; i < bullArr.length; ++i) {
    if (bullArr[i][0] < 0 || bullArr[i][0] > gameField.width) {
      bullArr.splice(i, 1);
    }
    if (bullArr[i][2] == 'player') {
      bullArr[i][0] -= bullArr[i][3];
      context.fillStyle = 'red';
    } else {
      context.fillStyle = 'blue';
      bullArr[i][0] += bullArr[i][3];
    }
    // console.log(bullArr[i][0], gameField.width);
    if (bullArr[i][0] < 0) {
      console.log('remove');
      bullArr.splice(i, 1);
    }
    // context.fillStyle = 'red';
    context.fillRect(bullArr[i][0], bullArr[i][1], 10, 10);
  }
}

function shot(y) {
  // print()
  if (bullArr.length < 20) {
    bullArr.push([playerPosX, y + (player.width / 2 - 10), 'player', bullSpeed]);
    // console.log(bullArr[bullArr.length - 1][0]);
  }
  // console.log(bullArr);
}

// enemy
let maxEnCount = 5;
const en1 = new Image();
en1.src = 'media/en1.png';
en1.width = 60;
en1.height = 50;

const enType1 = {
  id: 'enemy',
  life: true,
  speed: 2,
  bullSpeed: 4,
  damage: 1,
};

enArr = [];
// enArr = [[x,y,type]];

let enSp = setInterval(enemySpawn, 700);

function enemySpawn() {
  if (enArr.length > maxEnCount) return;
  let x = -20;
  let y = Math.floor(Math.random() * gameField.height - en1.height);
  enArr.push([x, y, en1, enType1]);
  // console.log(enArr);
}

function enUpdate() {
  if (enArr.length < 1) return;

  for (let i = 0; i < enArr.length; ++i) {
    // console.log(bullArr[i]);
    enArr[i][0] += enArr[i][3].speed;
    // console.log(bullArr[i][0], gameField.width);
    if (enArr[i][0] > gameField.width) {
      console.log('remove');
      enArr.splice(i, 1);
    }
    // context.fillStyle = 'red';
    // context.fillRect(enArr[i][0], enArr[i][1], 10, 10);
    context.drawImage(
      enArr[i][2],
      enArr[i][0],
      enArr[i][1],
      enArr[i][2].width,
      enArr[i][2].height
    );
  }
}
// enBullArr = [];
let enBullShot = setInterval(() => {
  if (enArr.length < 1) return;
  let i = Math.floor(Math.random() * (enArr.length - 1));
  console.log(i, enArr[i]);
  enShot(enArr[i]);
}, 1000);

function enShot(en) {
  console.log(en);
  // print()
  if (bullArr.length < 30) {
    bullArr.push([en[0], en[1] + (en1.width / 2 - 10), 'enemy', en[3].bullSpeed]);
    // console.log(bullArr[bullArr.length - 1][0]);
  }
  // console.log(bullArr);
}

// bullet

function bulletCheck() {
  for (let i = 0; i < bullArr.length; ++i) {
    if (check(bullArr[i])) {
      bullArr.splice(i, 1);
    }
  }
}
function check(bull) {
  for (let i = 0; i < enArr.length; ++i) {
    xMax = enArr[i][0] + enArr[i][2].width;
    xMin = enArr[i][0];
    yMax = enArr[i][1] + enArr[i][2].height;
    yMin = enArr[i][1];
    if (
      bull[0] >= xMin &&
      bull[0] <= xMax &&
      bull[1] >= yMin &&
      bull[1] <= yMax &&
      bull[2] != enArr[i][3].id
    ) {
      enArr.splice(i, 1);
      console.log('!');
      console.log('!destoy!');
      return true;
    }
  }
}
