const constants = require('./constants.js');
const Rx = require('rxjs');
const Op = require('rxjs/operators')

const { SHOOT_SPEED,
  PLAYER_MOVEMENT,
  SHOOT_DIMENSION,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
 } = constants;

let canvas = document.getElementById('app');
let context = canvas.getContext('2d');

const drawCanvas = () => {
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Add text color
  context.fillStyle = 'white';

  // Add players 
  context.fillRect(0, playerOnePosition, PLAYER_WIDTH, PLAYER_HEIGHT);
  context.fillRect(canvas.width - PLAYER_WIDTH, playerTwoPosition, PLAYER_WIDTH, PLAYER_HEIGHT);

  // Draw players shoot
  playerOneshootsOnScreen.forEach(shoot => {
    context.fillRect(shoot.xPosition - SHOOT_DIMENSION/2, shoot.yPosition-SHOOT_DIMENSION, SHOOT_DIMENSION, SHOOT_DIMENSION);
  })
  playerTwoshootsOnScreen.forEach(shoot => {
    context.fillRect(shoot.xPosition - SHOOT_DIMENSION/2, shoot.yPosition-SHOOT_DIMENSION, SHOOT_DIMENSION, SHOOT_DIMENSION);
  })  

  // Add number of lives per playes text
  context.font = "20px serif";
  context.fillText(`Lives: ${playerOneLives}`, 70, canvas.height - 10);
  context.fillText(`Lives: ${playerTwoLives}`, canvas.width - 120, canvas.height - 10); 
}	

const pressObservable = Rx.fromEvent(document, 'keydown'); // observable principal

// observables por tecla
const wObservable = pressObservable.pipe(Op.map(e => e.key), Op.filter(e => e == 'w'));
const sObservable = pressObservable.pipe(Op.map(e => e.key), Op.filter(e => e == 's'));
const dObservable = pressObservable.pipe(Op.map(e => e.key), Op.filter(e => e == 'd'));

const upObservable = pressObservable.pipe(Op.map(e => e.key), Op.filter(e => e == 'ArrowUp'));
const downObservable = pressObservable.pipe(Op.map(e => e.key), Op.filter(e => e == 'ArrowDown'));
const leftObservable = pressObservable.pipe(Op.map(e => e.key), Op.filter(e => e == 'ArrowLeft'));

const playerOneshootsOnScreen = [];
const playerTwoshootsOnScreen = [];

const FREQUENCY = 1000/60;

let playerOnePosition = canvas.height/2;
let playerTwoPosition = canvas.height/2;

// # of player lives
let playerOneLives = 10;
let playerTwoLives = 10;

// check if a shoot has reached a player
const checkCollision = (positionOne, positionTwo, margin) => {
  if (positionOne <= positionTwo + margin  && positionOne >= positionTwo) return true;
  return false;
}


const resetGame = () => {
  playerTwoLives = 10;
  playerOneLives = 10;
  playerOneshootsOnScreen.length = 0;
  playerTwoshootsOnScreen.length = 0;
}

const checkWinCondition = () => {
  if (playerOneLives === 0){
      console.log("Jugador 2 gana !!!");
      resetGame();
  }else if (playerTwoLives === 0){
    console.log("Jugador 1 gana !!!");
    resetGame();
  }
}


// check if players 1 or 2 shoot has hit the opponent
const checkShootsPosition = () => {
  playerOneshootsOnScreen.forEach(shoot => {
    if (checkCollision(shoot.xPosition, canvas.width, SHOOT_SPEED - 1) && 
        checkCollision(shoot.yPosition, playerTwoPosition, PLAYER_HEIGHT)) {
      playerTwoLives -= 1;
      checkWinCondition();
    }
  })
  playerTwoshootsOnScreen.forEach(shoot => {
    if (checkCollision(0, shoot.xPosition, SHOOT_SPEED - 1) && 
        checkCollision(shoot.yPosition, playerOnePosition, PLAYER_HEIGHT)) {
      playerOneLives -= 1;
      checkWinCondition();
    }
  })
}

// obrsevables para shoots
const source = Rx.interval(FREQUENCY);
source.pipe(
    Op.mergeMap(
      val => Rx.interval(FREQUENCY).pipe(Op.take(1)),
      () => {
        playerOneshootsOnScreen.map((shoot) => shoot.xPosition += SHOOT_SPEED);
        playerTwoshootsOnScreen.map((shoot) => shoot.xPosition -= SHOOT_SPEED);
        drawCanvas();
      },
      1
    )
  ).subscribe(() => checkShootsPosition());

dObservable.subscribe(function () {
  playerOneshootsOnScreen.push({
    xPosition: 0,
    yPosition: playerOnePosition + PLAYER_HEIGHT/2,
  })
});

leftObservable.subscribe(function () {
  playerTwoshootsOnScreen.push({
    xPosition: canvas.width,
    yPosition: playerTwoPosition + PLAYER_HEIGHT/2,
  })
});

wObservable.subscribe(function () {
  playerOnePosition -= PLAYER_MOVEMENT;
});

sObservable.subscribe(function () {
  playerOnePosition += PLAYER_MOVEMENT;
});

upObservable.subscribe(function () {
  playerTwoPosition -= PLAYER_MOVEMENT;
});

downObservable.subscribe(function () {
  playerTwoPosition += PLAYER_MOVEMENT;
});
