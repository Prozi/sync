"use strict";

const { Flow } = require("./flow");
const { Game } = require("./game");
const { Observable } = require("rxjs");
const BouncerJs = require("@jacekpietal/bouncer.js");

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
      flow instanceof BouncerJs;
      expect(flow).toBeInstanceOf(Flow);
    });

    it("THEN initialization without config works", () => {
      flow = new Flow();
      expect(flow).toBeInstanceOf(Flow);
    });

    it("THEN initializes game", (done) => {
      config = { keyboard: { name: "mockKeyboard" } };
      game = new Game(config);
      flow = new Flow(game);

      expect(flow).toBeInstanceOf(Flow);
      expect(game).toBeInstanceOf(Game);
      expect(game.subject$).toBeInstanceOf(Observable);

      game.subject$.subscribe((value) => {
        console.log(value);
        done();
      });
    });
  });

  describe("WHEN Flow is started with BouncerJS", () => {
    it("THEN it still works", (done) => {
      flow = new Flow(game, {
        port: 1337,
        plugins: {
          chat: (ws, message) => {
            flow.api.send(ws, message);
          },
        },
      });

      const WebSocket = require("ws");
      const address = `ws://localhost:${flow.config.port}`;
      const ws = new WebSocket(address);

      ws.onmessage = ({ data: string }) => {
        console.log("onmessage");
        const { id, event, data } = JSON.parse(string);

        expect(data).toBeTruthy();
        expect(id).toBeTruthy();
        expect(event).toBe(flow.config.join);

        socket.close();

        done();
      };

      ws.onopen = () => {
        console.log("onopen");
        flow.api.send(ws, { event: flow.config.join, data: "chat" });
      };

      console.log(`WebSocket connected at: ${address}`);
    });
  });
});
