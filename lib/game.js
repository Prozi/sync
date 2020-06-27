"use strict";

import { Subject } from "rxjs";
import { JoyStick } from "./joystick";

export const GameEvents = {
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
 * @property {Subject} subject$ Observable for events
 */
export class Game {
  /**
   * @param {Object|undefined} config Optional config for game
   */
  constructor(config = {}) {
    this.levels = new Set();
    this.subject$ = new Subject();
    this.joystick = new JoyStick();

    configure(this, {
      joystick: this.joystick.getEvents(),
    });

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

  bindEvents(groups = {}) {
    Object.values(groups).forEach((events) => {
      Object.entries(events || {}).forEach(([event, handler]) => {
        document.addEventListener(event, handler);
      });
    });
  }
}

/**
 * @param {Game} game Required game
 * @param {Object|undefined} config Configuration for game
 */
function configure(game, config = {}) {
  const { keyboard, mouse, touch, level, levels } = config;

  touch && game.useTouch(touch);
  mouse && game.useMouse(mouse);
  keyboard && game.useKeyboard(keyboard);

  level && game.addLevel(level);
  levels && Array.from(levels).forEach((lvl) => game.addLevel(lvl));
}
