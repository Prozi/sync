"use strict";

const { Observable } = require("rxjs");

const GameEvents = {
  UPDATED: "[Game] Updated",
};

/**
 * Configuration is done in next frame.
 *
 * @typedef {Game} Game
 * @property {Observable} subject$
 * @param {Object} config
 */
class Game {
  constructor(config = {}) {
    this.levels = new Set();
    this.subject$ = new Observable((subscriber) => {
      this.emit = (event = GameEvents.UPDATED, data = undefined) =>
        subscriber.next({ event, data });
    });

    Promise.resolve().then(() => {
      configure(this, config);
    });
  }

  useKeyboard(keyboard) {
    this.keyboard = keyboard;
    this.emit(GameEvents.UPDATED, keyboard);
  }

  useMouse(mouse) {
    this.mouse = mouse;
    this.emit(GameEvents.UPDATED, mouse);
  }

  useTouch(touch) {
    this.touch = touch;
    this.emit(GameEvents.UPDATED, touch);
  }

  addLevel(level) {
    this.levels.add(level);
    this.emit(GameEvents.UPDATED, level);
    this.emit(GameEvents.UPDATED, levels);
  }
}

function configure(game = new Game(), config = {}) {
  const { keyboard, mouse, touch, physics, level, levels } = config;
  keyboard && game.useKeyboard(keyboard);
  mouse && game.useMouse(mouse);
  touch && game.useTouch(touch);
  level && game.addLevel(level);
  levels && Array.from(levels).forEach((lvl) => game.addLevel(lvl));
}

module.exports.Game = Game;

module.exports.GameEvents = GameEvents;
