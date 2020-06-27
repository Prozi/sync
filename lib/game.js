"use strict";

const { Observable } = require("rxjs");

/**
 * Configuration is done in next frame.
 *
 * @typedef {Game} Game
 * @property {Observable} subject$
 * @param {Object} config
 */
class Game {
  constructor(config = {}) {
    this.subject$ = new Observable((subscriber) => {
      this.emit = subscriber.next.bind(subscriber);
    });

    Promise.resolve().then(() => {
      configure(this, config);
    });
  }

  useKeyboard(keyboard) {
    this.keyboard = keyboard;
    this.emit({ event: Game.EVENTS.UPDATED, keyboard });
  }

  useMouse(mouse) {
    this.mouse = mouse;
    this.emit({ event: Game.EVENTS.UPDATED, mouse });
  }

  useTouch(touch) {
    this.touch = touch;
    this.emit({ event: Game.EVENTS.UPDATED, touch });
  }

  addLevel(level) {
    this.levels = this.levels || new Set();
    this.levels.add(level);
    this.emit({ event: Game.EVENTS.UPDATED, level });
    this.emit({ event: Game.EVENTS.UPDATED, levels });
  }

  addPhysics(physics) {
    this.physics = physics;
    this.emit({ event: Game.EVENTS.UPDATED, physics });
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

Game.EVENTS = {
  UPDATED: "[Game] Updated",
};

module.exports.Game = Game;
