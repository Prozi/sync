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
    });
  }

  emit(event, data) {
    if (!Object.values(GameEvents).includes(event)) {
      throw new Error("Requires GameEvents event");
    }

    this.subject$.next({ event, data });
  }

  useKeyboard(keyboard) {
    this.use({ keyboard });
  }

  useMouse(mouse) {
    this.use({ mouse });
  }

  useTouch(touch) {
    this.use({ touch });
  }

  use(events = {}) {
    Object.entries(events).forEach(([name, value]) => {
      this[name] && this.emit(GameEvents.BEFORE_UPDATE, { [name]: this[name] });
      this[name] = value;
    });

    this.bindEvents(events);
    this.emit(GameEvents.UPDATE, events);
  }

  addLevel(level) {
    this.levels.add(level);
    this.emit(GameEvents.UPDATE, { level, levels });
  }

  bindEvents(events = {}) {
    Object.entries(events).forEach(([event, callback]) => {
      document.addEventListener(event, callback);
    });
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

module.exports.gameConfig = (game) => ({
  keyboard: {
    keydown: (event) => {
      console.log(event);
    },
    keyup: (event) => {
      console.log(event);
    },
  },
  mouse: {
    mousemove: (event) => {
      console.log(event);
    },
    mousedown: (event) => {
      console.log(event);
    },
    mouseup: (event) => {
      console.log(event);
    },
  },
  touch: {
    pointermove: (event) => {
      console.log(event);
    },
    touchstart: (event) => {
      console.log(event);
    },
    touchend: (event) => {
      console.log(event);
    },
  },
});
