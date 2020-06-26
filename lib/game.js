"use strict";

const { Subject } = require("rxjs");

class Game {
  constructor(config = {}) {
    this.subject = new Subject();

    configure(this, config);
  }

  useKeyboard(keyboard) {
    this.keyboard = keyboard;
    this.subject.next({ event: "KEYBOARD", keyboard });
  }

  useMouse(mouse) {
    this.mouse = mouse;
    this.subject.next({ event: "MOUSE", mouse });
  }

  useTouch(touch) {
    this.touch = touch;
    this.subject.next({ event: "TOUCH", touch });
  }

  addLevel(level) {
    this.levels = this.levels || new Set();
    this.levels.add(level);
    this.subject.next({ event: "LEVEL", level });
    this.subject.next({ event: "LEVELS", levels });
  }

  addPhysics(physics) {
    this.physics = physics;
    this.subject.next({ event: "PHYSICS", level });
  }
}

function configure(game = new Game(), config = {}) {
  const { keyboard, mouse, touch, physics, level, levels } = config;
  keyboard && game.useKeyboard(keyboard);
  mouse && game.useMouse(mouse);
  touch && game.useTouch(touch);
  physics && game.addPhysics(physics);
  level && game.addLevel(level);
  levels && Array.from(levels).forEach((lvl) => game.addLevel(lvl));
}

module.exports.Game = Game;
