"use strict";

import { Game } from "./game";
import BouncerJs from "@jacekpietal/bouncer.js";

/**
 * Creates Flow with Game.
 * Given config as second parameter will initialize BouncerJS api.
 *
 * @typedef {class} Flow
 * @property {Game} game Game instance
 */
export class Flow {
  /**
   * @param {Game|undefined} game Optional game instance
   * @param {Object|undefined} config Optional config for BouncerJS
   */
  constructor(game, config) {
    this.game = game || new Game({});

    if (config) {
      this.api = new BouncerJs(config);
    }
  }

  get joystick$() {
    return this.game.joystick.subject$;
  }
}
