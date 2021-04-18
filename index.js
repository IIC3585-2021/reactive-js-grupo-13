const constants = require('./constants.js');
const Rx = require('rxjs');

const { SHOOT_SPEED,
  PLAYER_MOVEMENT,
  SHOOT_DIMENSION,
  PLAYER_HEIGHT,
  PLAYER_WIDTH } = constants;


window.onload = function ()  {
  let canvas = document.getElementById('app');
  let context = canvas.getContext('2d');

  // Set frames
  setInterval(updateCanvas,  1000/60);
  
  // players vertical position
  let playerOnePosition = canvas.height/2;
  let playerTwoPosition = canvas.height/2;

  // shoots moving on screen
  const playerOneshootsOnScreen = [];
  const playerTwoshootsOnScreen = [];

  // player lives
  let playerOneLives = 10;
  let playerTwoLives = 10;

  const handleKeyboardInput = (e) => {
    const { key } = e;
    if (Object.keys(keyboardPlayerMoves).includes(key)) {
      const movePlayer = keyboardPlayerMoves[key];
      const positionChangeValue = keyboardMoveValues[key];
      movePlayer(positionChangeValue);
    } else if(Object.keys(keyboardPlayerShoots).includes(key)) {
      const playerShoot = keyboardPlayerShoots[key];
      playerShoot();
    }
  }

  window.addEventListener('keydown', handleKeyboardInput)

  const moveshootsOnScreen = () => {
    playerOneshootsOnScreen.forEach(shoot => {
      shoot.xPosition += SHOOT_SPEED;
    });
    playerTwoshootsOnScreen.forEach(shoot => {
      shoot.xPosition -= SHOOT_SPEED;
    });
  }
  
  const movePlayerOne = (positionChangeValue) => {
    playerOnePosition += positionChangeValue;
  }
  
  const movePlayerTwo = (positionChangeValue) => {
    playerTwoPosition += positionChangeValue;
  }
  
  const playerOneShoot = () => {
    const shoot = {
      xPosition: 0,
      yPosition: playerOnePosition + PLAYER_HEIGHT/2,
    }
    playerOneshootsOnScreen.push(shoot);
  }
  
  const playerTwoShoot = () => {
    const shoot = {
      xPosition: canvas.width,
      yPosition: playerTwoPosition + PLAYER_HEIGHT/2,
    }
    playerTwoshootsOnScreen.push(shoot);
  }
  
  const keyboardPlayerMoves = {
    w: movePlayerOne,
    s: movePlayerOne,
    ArrowUp: movePlayerTwo,
    ArrowDown: movePlayerTwo,
  }
  
  const keyboardPlayerShoots = {
    d: playerOneShoot,
    ArrowLeft: playerTwoShoot,
  }
  
  const keyboardMoveValues = {
    w: -PLAYER_MOVEMENT,
    s: PLAYER_MOVEMENT,
    ArrowUp: -PLAYER_MOVEMENT,
    ArrowDown: PLAYER_MOVEMENT,
  }

  const drawCanvas = () => {
    // create the canvas
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Add the text color
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
  
    // Add lives text
    context.font = "20px serif";
    context.fillText(`Lives: ${playerOneLives}`, 70, canvas.height - 10);
    context.fillText(`Lives: ${playerTwoLives}`, canvas.width - 120, canvas.height - 10); 
  }	

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
    if (playerOneLives === 0 || playerTwoLives === 0) {
      resetGame();
    }
  }

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

  function updateCanvas(){
      moveshootsOnScreen();
      drawCanvas();
      checkShootsPosition()
  }
}