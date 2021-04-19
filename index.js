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
} = constants

const pressObservable = Rx.fromEvent(document, 'keydown'); // observable principal

// observables por tecla
const wObservable = pressObservable.pipe(Op.map(e => e.key), Op.filter(e => e == 'w'));
const sObservable = pressObservable.pipe(Op.map(e => e.key), Op.filter(e => e == 's'));
const dObservable = pressObservable.pipe(Op.map(e => e.key), Op.filter(e => e == 'd'));

const upObservable = pressObservable.pipe(Op.map(e => e.key), Op.filter(e => e == 'ArrowUp'));
const downObservable = pressObservable.pipe(Op.map(e => e.key), Op.filter(e => e == 'ArrowDown'));
const leftObservable = pressObservable.pipe(Op.map(e => e.key), Op.filter(e => e == 'ArrowLeft'));


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

dObservable.subscribe(function () {
  addPlayerOneShot();
});

leftObservable.subscribe(function () {
  addPlayerTwoShot();
});

wObservable.subscribe(function () {
  changePlayerOnePosition(-1);
});

sObservable.subscribe(function () {
  changePlayerOnePosition(1);
});

upObservable.subscribe(function () {
  changePlayerTwoPosition(-1);
});

downObservable.subscribe(function () {
  changePlayerTwoPosition(1);
});
