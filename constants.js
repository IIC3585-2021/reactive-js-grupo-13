const canvas = document.getElementById('app');
const context = canvas.getContext('2d');

// players size
const PLAYER_HEIGHT = 50;
const PLAYER_WIDTH = 10;

// shoot size
const SHOOT_DIMENSION = 6;

// shot speed
const SHOOT_SPEED = 30;

// players vertical movement
const PLAYER_MOVEMENT = 40;

// active shoots
const playerOneshootsOnScreen = [];
const playerTwoshootsOnScreen = [];

// Frames
const FREQUENCY = 1000/60;

const SHOOT_TIME = 500;
const MOVE_TIME = 200;

const constants = {
    canvas,
    context,
    PLAYER_HEIGHT,
    PLAYER_WIDTH,
    SHOOT_DIMENSION,
    SHOOT_SPEED,
    PLAYER_MOVEMENT,
    playerOneshootsOnScreen,
    playerTwoshootsOnScreen,
    FREQUENCY,
    SHOOT_TIME,
    MOVE_TIME
}

module.exports = constants;