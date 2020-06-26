"use strict";

const { Game } = require("./game");
const isFront = typeof window !== "undefined";
const Bouncer = isFront
  ? Object.prototype.constructor
  : require("@jacekpietal/bouncer.js");

class Flow extends Bouncer {
  constructor(config = {}) {
    config.plugins = config.plugins || {};
    config.plugins.game = function ({ id, event, data }) {
      console.log({ id, event, data });
    };

    super(config);

    this.game = config.game || new Game();
    this.game.subject.subscribe(({ event }) => {
      console.log(event);
    });
  }
}

module.exports.Flow = Flow;
