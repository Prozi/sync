"use strict";

import { Flow } from "./flow";
import { Game } from "./game";
import { BehaviorSubject } from "rxjs";
import { first } from "rxjs/operators";
import BouncerJs from "@jacekpietal/bouncer.js";

describe("GIVEN Flow", () => {
  let config;
  let game;
  let flow;

  beforeEach(() => {
    config = {};
    game = new Game(config);
  });

  describe("WHEN it is initalized on frontend", () => {
    it("THEN initialization with config works", () => {
      flow = new Flow(game);
      expect(flow).toBeInstanceOf(Flow);
    });

    it("THEN initialization without config works", () => {
      flow = new Flow();
      expect(flow).toBeInstanceOf(Flow);
    });

    it("THEN initializes game", (done) => {
      config = {
        keyboard: {
          keydown: () => null,
        },
      };
      game = new Game(config);
      flow = new Flow(game);

      expect(flow).toBeInstanceOf(Flow);
      expect(game).toBeInstanceOf(Game);
      expect(game.subject$).toBeInstanceOf(BehaviorSubject);

      game.subject$.pipe(first()).subscribe((value) => {
        console.log(value);
        done();
      });
    });
  });

  describe("WHEN Flow is started with config", () => {
    it("THEN BouncerJS api is initialized and works", (done) => {
      flow = new Flow(game, {
        port: 1337,
        plugins: {
          chat: (ws, message) => {
            flow.api.send(ws, message);
          },
        },
      });

      expect(flow.api).toBeInstanceOf(BouncerJs);

      const WebSocket = require("ws");
      const address = `ws://localhost:${flow.api.config.port}`;
      const ws = new WebSocket(address);

      ws.onmessage = ({ data: string }) => {
        console.log("onmessage");
        const { id, event, data } = JSON.parse(string);

        expect(data).toBeTruthy();
        expect(id).toBeTruthy();
        expect(event).toBe(flow.api.config.join);

        ws.close();
        done();
      };

      ws.onopen = () => {
        console.log("onopen");
        flow.api.send(ws, { event: flow.api.config.join, data: "chat" });
      };

      console.log(`WebSocket connected at: ${address}`);
    });
  });
});
