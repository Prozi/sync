"use strict";

const { Game } = require("./game");
const isFront = typeof window !== "undefined" || process.env.JEST_FRONT;
const Bouncer = isFront
  ? Object.prototype.constructor
  : require("@jacekpietal/bouncer.js");

/**
 * @param {Game} Game
 * @param {Bouncer.BouncerConfig} bouncerConfig
 */
class Flow extends Bouncer {
  constructor(game) {
    super();

    this.game = game || new Game();
  }
}

module.exports.Flow = Flow;
