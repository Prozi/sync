"use strict";

import BouncerJs from "@jacekpietal/bouncer.js";
import chat from "@jacekpietal/bouncer.js/chat.js";
import { Game } from "./game";
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
    // lazy cache for static serving files
    const cache = params.cache || createCache();

    // more logs
    const debug = params.debug || false;

    // where do we start?
    const port = params.port || process.env.PORT || 8080;

    // bouncer-relative events
    const join = params.join || "/join";
    const leave = params.leave || "/leave";

    // one extra topic for rxjs game joystick
    const topic = params.topic || "echo";
    const folder = params.folder || `${__dirname}/../demo`;
    const LOGO = params.LOGO || "sync 🏄";
    const plugins = params.plugins || { chat };

    // init bouncer
    super({
      LOGO,
      debug,
      port,
      join,
      leave,
      plugins,
    });

    // extend plugin (may be after constructor)
    plugins[topic] = this.broadcast.bind(this);

    // initialize game
    this.game = new Game();

    // rxjs stuff
    this.subject$.subscribe(({ event, data }) => {
      this.broadcast({ topic }, { event, data });
    });

    this.router.get("/*", (res, req) =>
      staticServe({ folder }, res, req, cache),
    );
  }

  get subject$() {
    return this.game.subject$;
  }
}
