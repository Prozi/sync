"use strict";

import { Subject } from "rxjs";

export const GameEvents = {
  CONFIGURED: "[Game] Configured",
  UPDATE: "[Game] Updated",
  BEFORE_UPDATE: "[Game] Before Update",
  JOYSTICK: "[Game] Joystick Update",
};

/**
 * Creates Game.
 * Configures from config in next frame.
 *
 * @typedef {class} Game
 * @property {Set} levels Set with levels
 * @property {Subject} subject$ Observable for events
 */
export class Game {
  /**
   * @param {Object|undefined} config Optional config for game
   */
  constructor(config = {}) {
    this.levels = new Set();
    this.subject$ = new Subject();
    this.joystick = { x: 0, y: 0, fire: false };

    Promise.resolve().then(() => {
      configure(this, {
        touch: {
          pointermove: (event) => {
            this.joystickEvent(event, this.joystick.fire);
          },
          pointerdown: (event) => {
            this.joystickEvent(event, true);
          },
          pointerup: (event) => {
            this.joystickEvent(event, false);
          },
        },
        ...config,
      });
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

  bindEvents(groups = {}) {
    Object.values(groups).forEach((events) => {
      Object.entries(events).forEach(([event, handler]) => {
        document.addEventListener(event, handler);
      });
    });
  }

  joystickEvent(event, fire) {
    this.joystick.x = event.pageX / window.innerWidth - 0.5;
    this.joystick.y = event.pageY / window.innerHeight - 0.5;
    this.joystick.fire = fire;

    this.emit(GameEvents.JOYSTICK, { joystick: this.joystick });
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

  game.emit(GameEvents.CONFIGURED, false);
}
