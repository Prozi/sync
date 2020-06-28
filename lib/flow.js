"use strict";

import fs from "fs";
import path from "path";
import { Game } from "./game";
import Later from "latermom";
import BouncerJs from "@jacekpietal/bouncer.js";
import { staticServe } from "./static-serve";

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
    let { debug, port, topic, plugins, folder, join, leave } = params || {};

    debug = debug || false;
    port = port || 8080;
    join = join || "/join";
    leave = leave || "/leave";
    topic = topic || "echo";
    plugins = plugins || {};
    plugins[topic] = this.echo.bind(this);
    folder = folder || `${__dirname}/../demo`;

    this.game = new Game();
    this.api = new BouncerJs({
      debug,
      port,
      join,
      leave,
      plugins,
    });

    this.subject$.subscribe(({ event, data }) => {
      this.api.broadcast({ topic }, { event, data });
    });

    this.api.router.get("/*", (req, res) => staticServe({ folder }, req, res));
  }

  echo(ws, { id, event, data }) {
    this.api.broadcast(ws, { id, event, data });
  }

  get subject$() {
    return this.game.subject$;
  }
}
