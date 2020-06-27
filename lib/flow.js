"use strict";

import { Game } from "./game";

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

    if (config && process.env.NODE_ENV) {
      import("@jacekpietal/bouncer.js").then((BouncerJs) => {
        this.api = new BouncerJs(config);
      });
    }
  }
}
