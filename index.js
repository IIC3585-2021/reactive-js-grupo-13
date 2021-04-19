const utils = require('./utils.js');
const Rx = require('rxjs');
const Op = require('rxjs/operators');
const constants = require('./constants.js');

const {
  drawCanvas,
  move_shots,
  checkShootsPosition,
  changePlayerOnePosition,
  changePlayerTwoPosition,
  addPlayerOneShot,
  addPlayerTwoShot,
} = utils;

const {
  FREQUENCY,
  SHOOT_TIME,
  MOVE_TIME
} = constants

const pressObservable = Rx.fromEvent(document, 'keydown').pipe(Op.filter(e => !e.repeat)); // observable principal

// observables por tecla
const wObservable = pressObservable.pipe(Op.pluck('key'), Op.filter(e => e == 'w'));
const sObservable = pressObservable.pipe(Op.pluck('key'), Op.filter(e => e == 's'));
const dObservable = pressObservable.pipe(Op.pluck('key'), Op.filter(e => e == 'd'), Op.throttleTime(SHOOT_TIME));

const upObservable = pressObservable.pipe(Op.pluck('key'), Op.filter(e => e == 'ArrowUp'));
const downObservable = pressObservable.pipe(Op.pluck('key'), Op.filter(e => e == 'ArrowDown'));
const leftObservable = pressObservable.pipe(Op.pluck('key'), Op.filter(e => e == 'ArrowLeft'), Op.throttleTime(SHOOT_TIME));

// obrsevables para shoots
const source = Rx.interval(FREQUENCY);
source.pipe(
    Op.mergeMap(
      val => Rx.interval(FREQUENCY).pipe(Op.take(1)),
      () => {
        move_shots();
        drawCanvas();
      },
      1
    )
  ).subscribe(() => checkShootsPosition());

// crear un shot
dObservable.subscribe(() => addPlayerOneShot());
leftObservable.subscribe(() => addPlayerTwoShot());

// desplazamiento jugadores
wObservable.subscribe(() => changePlayerOnePosition(-1));
sObservable.subscribe(() => changePlayerOnePosition(1));
upObservable.subscribe(() => changePlayerTwoPosition(-1));
downObservable.subscribe(() => changePlayerTwoPosition(1));
