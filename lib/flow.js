"use strict";

import BouncerJs from "@jacekpietal/bouncer.js";
import { Game, gameConfig } from "./game";

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
    this.joystick = { x: 0, y: 0, fire: false };
    this.game = game || new Game(gameConfig(this));

    if (config) {
      this.api = new BouncerJs(config);
    }
  }
}

export default { Flow };
