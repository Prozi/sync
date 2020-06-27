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
   * @param {Game|undefined} game Optional game instance
   * @param {Object|undefined} config Optional config for BouncerJS
   */
  constructor(game, config) {
    this.game = game || new Game();

    if (config) {
      this.api = new BouncerJs(config);

      this.subject$.subscribe(({ event, data }) => {
        this.api.broadcast({ topic: "echo" }, { event, data });
      });

      const index = this.api.config.index || "../demo/";

      this.cache = new Later((filename) =>
        fs.readFileSync(path.resolve(__dirname, index, filename)),
      );

      fs.readdir(path.resolve(__dirname, index), (err, data) => {
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
  }

  get subject$() {
    return this.game.subject$;
  }
}
