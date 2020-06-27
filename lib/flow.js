"use strict";

import fs from "fs";
import path from "path";
import { Game } from "./game";
import Later from "latermom";
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
   * @param {port} number
   * @param {boolean} debug
   * @param {string} topic
   * @property {string} topic
   * @property {Game} game
   * @property {BouncerJs} api
   * @property {Later} cache
   */
  constructor(params) {
    let { debug, port, topic } = params || {};

    port = port || 8080;
    debug = debug || false;
    topic = topic || "echo";

    this.game = new Game();

    const config = {
      port,
      debug,
      plugins: {
        [topic]: this.echo.bind(this),
      },
    };

    this.api = new BouncerJs(config);

    this.subject$.subscribe(({ event, data }) => {
      this.api.broadcast({ topic }, { event, data });
    });

    const directory =
      this.api.config.index || path.resolve(__dirname, "..", "demo");

    this.cache = new Later((filename) =>
      fs.readFileSync(path.resolve(directory, filename)),
    );

    fs.readdir(directory, (err, data) => {
      if (err) {
        return console.warn(err);
      }

      data.forEach((filename) => {
        this.api.router.get(
          `/${filename.startsWith("index.") ? "" : filename}`,
          (res) => {
            res.end(this.cache.get(filename));
          },
        );
      });
    });
  }

  echo(ws, { id, event, data }) {
    this.api.broadcast(ws, { id, event, data });
  }

  get subject$() {
    return this.game.subject$;
  }
}
