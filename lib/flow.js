"use strict";

const { Game } = require("./game");
const BouncerJs = require("@jacekpietal/bouncer.js");

/**
 * Creates Game.
 * If on backend, based on bouncer.
 *
 * @typedef {Flow} Flow
 * @property {Game} game
 * @param {Game} game
 */
class Flow {
  constructor(game, config) {
    this.game = game || new Game();

    if (config) {
      this.api = new BouncerJs(config);
    }
  }
}

module.exports.Flow = Flow;
