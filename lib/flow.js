"use strict";

import { Game } from "./game";
import BouncerJs from "@jacekpietal/bouncer.js";
import { staticServe, createCache } from "./static-serve";

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
    let { cache, debug, port, topic, plugins, folder, join, leave } =
      params || {};

    cache = cache || createCache();
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

    this.api.router.get("/*", (res, req) =>
      staticServe({ folder }, res, req, cache),
    );
  }

  echo(ws, { id, event, data }) {
    this.api.broadcast(ws, { id, event, data });
  }

  get subject$() {
    return this.game.subject$;
  }
}
