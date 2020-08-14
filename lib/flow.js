"use strict";

import { Game } from "./game";
import BouncerJs from "@jacekpietal/bouncer.js";
import chat from "@jacekpietal/bouncer.js/chat.js";
import { staticServe, createCache } from "./static-serve";

/**
 * Creates Flow with Game.
 */
export class Flow extends BouncerJs {
  /**
   * @param {Object} params { debug: boolean, port: number, topic: string }
   * @property {string} topic
   * @property {Game} game
   * @property {LazyCache} cache
   * @returns {BouncerJs} Flow
   */
  constructor(params = {}) {
    const cache = params.cache || createCache();
    const debug = params.debug || false;
    const port = params.port || process.env.PORT || 8080;
    const join = params.join || "/join";
    const leave = params.leave || "/leave";
    const topic = params.topic || "echo";
    const folder = params.folder || `${__dirname}/../demo`;
    const LOGO = params.LOGO || "sync 🏄";
    const plugins = params.plugins || { chat };

    super({
      LOGO,
      debug,
      port,
      join,
      leave,
      plugins,
    });

    plugins[topic] = this.echo.bind(this);

    this.game = new Game();

    this.subject$.subscribe(({ event, data }) => {
      this.broadcast({ topic }, { event, data });
    });

    this.router.get("/*", (res, req) =>
      staticServe({ folder }, res, req, cache),
    );
  }

  echo(ws, { id, event, data }) {
    this.broadcast(ws, { id, event, data });
  }

  get subject$() {
    return this.game.subject$;
  }
}
