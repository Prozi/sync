"use strict";

import { Subject } from "rxjs";
import { JoyStick } from "./joystick";

export const GameEvents = {
  CONFIGURED: "[Game] Configured",
  UPDATE: "[Game] Updated",
  BEFORE_UPDATE: "[Game] Before Update",
  JOYSTICK_EVENT: JoyStick.EVENT,
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
    this.joystick.subject$.subscribe(({ x, y, fire }) => {
      this.emit(JoyStick.EVENT, { x, y, fire });
    });

    configure.call(this, {
      joystick: this.joystick.getEvents(),
    });

    Promise.resolve().then(() => {
      configure.call(this, config);
    });
  }

  emit(event, data) {
    if (!Object.values(GameEvents).includes(event)) {
      throw new Error("Requires GameEvents event");
    }

    this.subject$.next({ event, data });
  }

  use(events = {}) {
    Object.entries(events).forEach(([name, value]) => {
      this[name] && this.emit(GameEvents.BEFORE_UPDATE, { [name]: this[name] });
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
 * this = Game (scope: private)
 * @param {Game} game Required game
 * @param {Object|undefined} config Configuration for game
 */
function configure(config = {}) {
  const { joystick, keyboard, mouse, touch, level, levels } = config;

  joystick && this.use({ joystick });
  keyboard && this.use({ keyboard });
  touch && this.use({ touch });
  mouse && this.use({ mouse });

  level && this.addLevel(level);
  levels && Array.from(levels).forEach((lvl) => this.addLevel(lvl));

  this.emit(GameEvents.UPDATE, config);
}
