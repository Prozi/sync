"use strict";

const { Observable } = require("rxjs");

const GameEvents = {
  CONFIGURED: "[Game] Configured",
  UPDATE: "[Game] Updated",
  BEFORE_UPDATE: "[Game] Before Update",
};

/**
 * Creates Game.
 * Configures from config in next frame.
 *
 * @typedef {class} Game
 * @property {Set} levels Set with levels
 * @property {Observable} subject$ Observable for events
 */
class Game {
  /**
   * @param {Object|undefined} config Optional config for game
   */
  constructor(config = {}) {
    this.levels = new Set();

    this.subject$ = new Observable((subscriber) => {
      this.emit = (event = GameEvents.UPDATE, data) =>
        subscriber.next({ event, data });
    });

    // Configure in next frame
    Promise.resolve().then(() => {
      configure(this, config);
    });
  }

  useKeyboard(keyboard) {
    this.keyboard &&
      this.emit(GameEvents.BEFORE_UPDATE, { keyboard: this.keyboard });
    this.keyboard = keyboard;
    this.emit(GameEvents.UPDATE, { keyboard });
  }

  useMouse(mouse) {
    this.mouse && this.emit(GameEvents.BEFORE_UPDATE, { mouse: this.mouse });
    this.mouse = mouse;
    this.emit(GameEvents.UPDATE, { mouse });
  }

  useTouch(touch) {
    this.touch && this.emit(GameEvents.BEFORE_UPDATE, { touch: this.touch });
    this.touch = touch;
    this.emit(GameEvents.UPDATE, { touch });
  }

  addLevel(level) {
    this.levels.add(level);
    this.emit(GameEvents.UPDATE, { level, levels });
  }
}

function configure(game = new Game(), config = {}) {
  const { keyboard, mouse, touch, level, levels } = config;

  keyboard && game.useKeyboard(keyboard);
  mouse && game.useMouse(mouse);
  touch && game.useTouch(touch);
  level && game.addLevel(level);
  levels && Array.from(levels).forEach((lvl) => game.addLevel(lvl));

  game.emit(GameEvents.CONFIGURED, true);
}

module.exports.Game = Game;

module.exports.GameEvents = GameEvents;
