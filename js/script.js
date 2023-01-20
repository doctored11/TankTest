const gameField = document.getElementById('field');
const context = gameField.getContext('2d');

const player = new Image();
player.src = 'media/tank.png';

const en1 = new Image();
const en2 = new Image();
const en3 = new Image();
en2.src = 'media/en2.png';
en1.src = 'media/en1.png';
en3.src = 'media/en3.png';
const vzrv = new Image();
vzrv.src = 'media/vzrv.png';

player.width = 60;
player.height = 50;

let bUp = document.getElementById('up');
let bDown = document.getElementById('down');
//
const screenWidth = window.screen.width;
if (screenWidth < 600) {
  gameField.setAttribute(
    'style',
    `width:${screenWidth * 0.8}px; height:${screenWidth * 0.8}px `
  );
  // gameField.width = screenWidth * 0.8;
  // gameField.height = screenWidth * 0.8;
}

//

let score = 0;
let health = 3;
const tank1Property = {
  tankSpeed: player.height / 2,
  id: 'player',
  life: true,
  damageSpeed: 500,
  bullSpeed: 1,
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

let hCount = document.querySelector('.health-counter');
let sCount = document.querySelector('.score-counter');
bufwidth = player.width;
cadrNum = 0;

function drawTick() {
  cadrNum++;
  if (cadrNum % 15 == 0) player.width = bufwidth;
  if (score > 1000) {
    win();
    sCount.textContent = 'Это победа  ' + score;
    return;
  }
  if (endGameCheck()) {
    console.log('! endGame');
    return;
  }
  checkSpawCount();

  hCount.textContent = 'Health: ' + health;
  sCount.textContent = 'Score: ' + score;

  context.clearRect(0, 0, gameField.width, gameField.height);
  // player.onload = function () {
  context.drawImage(player, playerPosX, playerY, player.width, player.height);
  // };

  bullUpdate();
  enUpdate();
  bulletCheck();

  // vzrvUpdate();
}
//

let gameTick = setInterval(drawTick, 1);
let bullShot =
  setInterval(() => {
    // console.log('bullShot Y=', playerY);
    playSound('shot');
    shot(playerY);
  }, damageSpeed - (score / 50) ** 2) + 5;

function endGameCheck() {
  if (document.querySelector('.restart-btn')) return true;
  for (let i = 0; i < enArr.length; ++i) {
    if (enArr[i][0] > gameField.width) {
      endMenu();
      return true;
    }
    if (health <= 0) {
      endMenu();
      return true;
    }
  }
}
//player
bDown.addEventListener('click', () => {
  step = tankSpeed;
  playerY += step;
});
bUp.addEventListener('click', () => {
  step = -tankSpeed;
  playerY += step;
});

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

vzrv.width = 20;
vzrv.height = 20;
en1.width = 60;
en1.height = 50;
en2.width = en1.width;
en2.height = en1.height;
en3.width = en1.width;
en3.height = en1.height;
const vzv = {
  ico: vzrv,
};

const enType1 = {
  id: 'enemy',
  life: true,
  speed: 0.17,
  bullSpeed: 0.5,

  ico: en1,
};
const enType2 = {
  id: 'enemy',
  life: true,
  speed: 0.14,
  bullSpeed: 1.65,

  ico: en2,
};
const enType3 = {
  id: 'enemy',
  life: true,
  speed: 0.6,
  bullSpeed: 1,

  ico: en3,
};

enArr = [];
// enArr = [[x,y,type]];

let enSp = setInterval(enemySpawn, 700);

function enemySpawn() {
  if (enArr.length > maxEnCount) return;
  let x = -20;
  let y = Math.floor(Math.random() * (gameField.height - 100));
  let type = typeRandom();

  enArr.push([x, y, type.ico, type]);
  // console.log(enArr);
}

function enUpdate() {
  if (enArr.length < 1) return;

  for (let i = 0; i < enArr.length; ++i) {
    // console.log(bullArr[i]);
    enArr[i][0] += enArr[i][3].speed;
    // console.log(bullArr[i][0], gameField.width);
    if (enArr[i][0] > 1.2 * gameField.width) {
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
  // console.log(i, enArr[i]);

  enShot(enArr[i]);
}, 3000);

function enShot(en) {
  // console.log(en);
  // print()
  if (bullArr.length < 30) {
    bullArr.push([en[0], en[1] + (en1.width / 2 - 10), 'enemy', en[3].bullSpeed]);
    // console.log(bullArr[bullArr.length - 1][0]);
  }
  // console.log(bullArr);
}

function typeRandom() {
  ran = Math.random();
  // console.log(ran);
  if (score > 100 && ran < 0.3) return enType2;
  else if (score > 250 && ran < 0.55) return enType2;
  else if (score > 250 && ran < 0.6) return enType3;
  else if (score > 400 && ran < 0.7) return enType2;
  else if (score > 400 && ran < 0.8) return enType3;
  else if (score > 600 && ran < 0.3) return enType2;
  else if (score > 600 && ran < 0.45) return enType3;
  else if (score > 800 && ran < 0.4) return enType2;
  else if (score > 800 && ran < 0.45) return enType3;
  else if (score > 900 && ran < 0.5) return enType2;
  else if (score > 900 && ran < 0.85) return enType3;
  return enType1;
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
  xMin = playerPosX;
  xMax = playerPosX + player.width;
  yMin = playerY;
  yMax = playerY + player.height;

  if (
    bull[0] < xMax &&
    bull[0] > xMin &&
    bull[1] >= yMin &&
    bull[1] <= yMax &&
    bull[2] != tank1Property.id
  ) {
    health -= 1;
    playSound('plDamge');

    player.width *= 0.8;

    return true;
  }

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
      vzrvAdd(enArr[i][0], enArr[i][1]);

      enArr.splice(i, 1);

      score += 5;
      console.log(score);
      return true;
    }
  }
}

// -----

function checkSpawCount() {
  maxEnCount = 4 + Math.floor(score / 150);
}
function vzrvAni(vz) {
  playSound('enDeth');
  for (let i = 0; i < 30; ++i) {
    setTimeout(() => {
      vz[0] -= 5;
      vz[1] -= 5;
      vz[2] += 10;
      vz[3] += 10;
      context.drawImage(vz[4], vz[0], vz[1], vz[2], vz[3]);
    }, 0.2);
  }

  return true;
}

vzrvArr = [];

function vzrvAdd(x, y) {
  vzrvArr.push([x, y, 20, 20, vzv.ico]);
  // vzrvUpdate();
  vzrvAni(vzrvArr[vzrvArr.length - 1]);
  if (vzrvAni(vzrvArr[vzrvArr.length - 1])) vzrvArr.splice(vzrvArr.length - 1, 1);
}

// restart

function restart() {
  health = 3;
  score = 0;
  enArr = [];
  bullArr = [];
}

function endMenu() {
  let grayBlock = document.createElement('div');
  if (screenWidth < 600) {
    grayBlock.setAttribute(
      'style',
      `width:${screenWidth * 0.8}px; height:${screenWidth * 0.8}px `
    );
    console.log(screenWidth);
  } else {
    console.log(screenWidth);
    grayBlock.setAttribute(
      'style',
      `width:${gameField.width}px; height:${gameField.height}px `
    );
  }

  // grayBlock.setAttribute('style', `height:${gameField.height}px`);
  grayBlock.classList.add('blockField');
  let gb = document.querySelector('.game-block');
  gb.appendChild(grayBlock);

  let button = document.createElement('input');
  button.type = 'button';
  button.classList.add('restart-btn');
  button.value = 'Еще разок';
  button.addEventListener('click', () => {
    grayBlock.remove();
    // playSound('fon');
    restart();
  });

  grayBlock.appendChild(button);
}

function win() {
  if (document.querySelector('.restart-btn')) return true;
  let grayBlock = document.createElement('div');

  if (screenWidth < 600) {
    grayBlock.setAttribute(
      'style',
      `width:${screenWidth * 0.8}px; height:${screenWidth * 0.8}px `
    );
    console.log(screenWidth);
  } else {
    console.log(screenWidth);
    grayBlock.setAttribute(
      'style',
      `width:${gameField.width}px; height:${gameField.height}px `
    );
  }

  // grayBlock.setAttribute('style', `height:${gameField.height}px`);
  grayBlock.classList.add('blockField');
  grayBlock.classList.add('blockField--win');
  let gb = document.querySelector('.game-block');
  gb.appendChild(grayBlock);

  let button = document.createElement('input');
  button.type = 'button';
  button.classList.add('restart-btn');
  button.value = 'Еще раз победить)';
  button.addEventListener('click', () => {
    grayBlock.remove();
    restart();
  });

  grayBlock.appendChild(button);
}

function playSound(e) {
  console.log(e);
  let audio = document.querySelector(`audio[data-key="${e}"]`);
  audio.currentTime = 0.1;
  audio.play();
}
