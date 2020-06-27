"use strict";

const { Game } = require("./game");
const BouncerJs = require("@jacekpietal/bouncer.js");

const defaultGameConfig = {
  keyboard: {
    keydown: (event) => {
      console.log(event);
    },
  },
  mouse: {
    mousemove: (event) => {
      console.log(event);
    },
    mousedown: (event) => {
      console.log(event);
    },
    mouseup: (event) => {
      console.log(event);
    },
  },
  touch: {
    pointermove: (event) => {
      console.log(event);
    },
    touchstart: (event) => {
      console.log(event);
    },
    touchend: (event) => {
      console.log(event);
    },
  },
};

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
    this.userInput = { x: 0, y: 0 };
    this.game = game || new Game(defaultGameConfig);

    if (config) {
      this.api = new BouncerJs(config);
    }
  }
}

module.exports.Flow = Flow;
