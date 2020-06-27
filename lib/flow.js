"use strict";

const { Game } = require("./game");
const isFront = typeof window !== "undefined";
const Bouncer = isFront
  ? Object.prototype.constructor
  : require("@jacekpietal/bouncer.js");

/**
 * Creates Game.
 * If on backend, based on bouncer.
 *
 * @typedef {Flow} Flow
 * @property {Game} game
 * @param {Game} game
 * @param {Bouncer.BouncerConfig} config
 */
class Flow extends Bouncer {
  constructor(game, config) {
    super(config);

    this.game = game || new Game();
  }
}

module.exports.Flow = Flow;
