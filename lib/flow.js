"use strict";

import fs from "fs";
import path from "path";
import { Game } from "./game";
import Later from "latermom";
import BouncerJs from "@jacekpietal/bouncer.js";

/**
 * Creates Flow with Game.
 */
export class Flow {
  /**
   * @param {Object} params { debug: boolean, port: number, topic: string }
   * @property {string} topic
   * @property {Game} game
   * @property {BouncerJs} api
   * @property {Later} cache
   * @returns {class} Flow
   */
  constructor(params) {
    let { debug, port, topic, plugins, folder } = params || {};

    port = port || 8080;

    debug = debug || false;
    folder = folder || path.resolve(__dirname, "..", "demo");

    topic = topic || "echo";
    plugins = plugins || {};
    plugins[topic] = this.echo.bind(this);

    this.game = new Game();
    this.api = new BouncerJs({
      port,
      debug,
      plugins,
    });

    this.subject$.subscribe(({ event, data }) => {
      this.api.broadcast({ topic }, { event, data });
    });

    this.cache = new Later((filename) =>
      fs.readFileSync(path.resolve(folder, filename)),
    );

    fs.readdir(folder, (err, data) => {
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
