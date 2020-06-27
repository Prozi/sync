"use strict";

import { BehaviorSubject } from "rxjs";
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
 * @property {BehaviorSubject} subject$ Observable for events
 */
export class Game {
  /**
   * @param {Object|undefined} config Optional config for game
   */
  constructor(config = {}) {
    this.uses = {};
    this.levels = new Set();
    this.subject$ = new BehaviorSubject({});

    this.addJoyStick();

    config && this.configure(config);
    this.emit(GameEvents.CONFIGURED, true);
  }

  /**
   * this = Game (scope: private)
   * @param {Game} game Required game
   * @param {Object|undefined} config Configuration for game
   */
  configure(config = {}) {
    Object.entries(config).forEach(([name, data]) => {
      switch (name) {
        case "level":
          this.addLevel(data);
          break;
        case "levels":
          Array.from(data).forEach((level) => this.addLevel(level));
          break;
        default:
          this.use({ [name]: data });
      }
    });

    this.emit(GameEvents.UPDATE, config);
  }

  addJoyStick() {
    this.joystick = new JoyStick();
    this.joystick.subject$.subscribe(({ x, y, fire }) => {
      this.emit(JoyStick.EVENT, { x, y, fire });
    });
    this.configure({ joystick: this.joystick.getEvents() });
  }

  /**
   * @param {GameEvents} event
   * @param {any} data
   */
  emit(event, data) {
    if (!Object.values(GameEvents).includes(event)) {
      throw new Error("Requires GameEvents event");
    }

    this.subject$.next({ event, data });
  }

  /**
   * @param {object} events
   */
  use(events) {
    if (!events || !Object.keys(events).length) {
      return;
    }

    Object.entries(events).forEach(([name, event]) => {
      if (this.uses[name]) {
        this.emit(GameEvents.BEFORE_UPDATE, { [name]: this.uses[name] });
      }
      this.uses[name] = event;
    });

    this.bindEvents(events);
    this.emit(GameEvents.UPDATE, events);
  }

  /**
   * @param {any} level
   */
  addLevel(level) {
    this.levels.add(level);
    this.emit(GameEvents.UPDATE, { level, levels });
  }

  /**
   * @param {Object} groups
   */
  bindEvents(groups = {}) {
    Object.values(groups).forEach((events) => {
      Object.entries(events || {}).forEach(([event, handler]) => {
        document.addEventListener(event, handler);
      });
    });
  }
}
