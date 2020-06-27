"use strict";

const { Game, gameConfig } = require("./game");
const BouncerJs = require("@jacekpietal/bouncer.js");

/**
 * Creates Flow with Game.
 * Given config as second parameter will initialize BouncerJS api.
 *
 * @typedef {class} Flow
 * @property {Game} game Game instance
 */
class Flow {
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

module.exports.Flow = Flow;
