"use strict";

import { BehaviorSubject } from "rxjs";
import { JoyStick } from "./lib/joystick.js";

const GameEvents = {
  CONFIGURED: "[Game] Configured",
  UPDATE: "[Game] Updated",
  BEFORE_UPDATE: "[Game] Before Update",
  JOYSTICK_EVENT: JoyStick.EVENT,
};

/**
 * The meat
 */
export default class Game {
  /**
   * @param {Object} config Optional config for game
   * @property {Set} levels Set with levels
   * @property {BehaviorSubject} subject$ Observable for events
   * @returns {class} Game
   */
  constructor(config) {
    this.uses = {};
    this.levels = new Set();
    this.subject$ = new BehaviorSubject({});
    this.EVENTS = GameEvents;

    this.addJoyStick();

    this.configure(config);
    this.emit(this.EVENTS.CONFIGURED, true);
  }

  /**
   * @param {Object} config Configuration for game
   */
  configure(config) {
    if (!config) {
      return;
    }

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

    this.emit(this.EVENTS.UPDATE, config);
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
    if (!Object.values(this.EVENTS).includes(event)) {
      throw new Error("Requires this.EVENTS event");
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
        this.emit(this.EVENTS.BEFORE_UPDATE, { [name]: this.uses[name] });
      }
      this.uses[name] = event;
    });

    this.bindEvents(events);
    this.emit(this.EVENTS.UPDATE, events);
  }

  /**
   * @param {any} level
   */
  addLevel(level) {
    this.levels.add(level);
    this.emit(this.EVENTS.UPDATE, { level, levels });
  }

  /**
   * @param {Object} groups
   */
  bindEvents(groups = {}) {
    Object.values(groups).forEach((events) => {
      Object.entries(events || {}).forEach(([event, handler]) => {
        if (typeof document !== "undefined") {
          document.addEventListener(event, handler);
        }
      });
    });
  }
}
