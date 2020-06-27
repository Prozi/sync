"use strict";

const { Subject } = require("rxjs");

const GameEvents = {
  CONFIGURE: "[Game] Configured",
  UPDATE: "[Game] Updated",
  BEFORE_UPDATE: "[Game] Before Update",
};

/**
 * Creates Game.
 * Configures from config in next frame.
 *
 * @typedef {class} Game
 * @property {Set} levels Set with levels
 * @property {Subject} subject$ Observable for events
 */
class Game {
  /**
   * @param {Object|undefined} config Optional config for game
   */
  constructor(config = {}) {
    this.levels = new Set();
    this.subject$ = new Subject();

    Promise.resolve().then(() => {
      configure(this, config);
    })
  }

  emit(event, data) {
    if (!Object.values(GameEvents).includes(event)) {
      throw new Error("Requires GameEvents event");
    }

    this.subject$.next({ event, data });
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

/**
 * @param {Game} game Required game
 * @param {Object|undefined} config Configuration for game
 */
function configure(game, config = {}) {
  const { keyboard, mouse, touch, level, levels } = config;

  keyboard && game.useKeyboard(keyboard);
  mouse && game.useMouse(mouse);
  touch && game.useTouch(touch);
  level && game.addLevel(level);
  levels && Array.from(levels).forEach((lvl) => game.addLevel(lvl));
}

module.exports.Game = Game;

module.exports.GameEvents = GameEvents;
