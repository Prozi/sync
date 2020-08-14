"use strict";

import { Flow } from "./flow";
import { Game } from "./game";
import { BehaviorSubject } from "rxjs";
import { first } from "rxjs/operators";
import BouncerJs from "@jacekpietal/bouncer.js";
import UWebSocket from "@jacekpietal/bouncer.js/client";

describe("GIVEN Flow", () => {
  let config;
  let flow;

  beforeEach(() => {
    config = {};
  });

  describe("WHEN it is initalized on frontend", () => {
    it("THEN initialization with config works", () => {
      flow = new Flow({ debug: true });
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
      flow = new Flow(config);

      expect(flow).toBeInstanceOf(Flow);
      expect(flow.game).toBeInstanceOf(Game);
      expect(flow.game.subject$).toBeInstanceOf(BehaviorSubject);

      flow.game.subject$.pipe(first()).subscribe((value) => {
        console.log(value);
        done();
      });
    });
  });

  describe("WHEN Flow is started with config", () => {
    it("THEN BouncerJS api is initialized and works", (done) => {
      flow = new Flow({ port: 1337 });

      expect(flow).toBeInstanceOf(BouncerJs);

      const WebSocket = require("ws");
      const address = `ws://localhost:1337`;
      const ws = new WebSocket(address);

      ws.onmessage = ({ data: string }) => {
        console.log("onmessage");
        const { id, event, data } = JSON.parse(string);

        expect(data).toBeTruthy();
        expect(id).toBeTruthy();
        expect(event).toBe(flow.config.join);

        ws.close();
        done();
      };

      ws.onopen = () => {
        console.log("onopen");
        flow.send(ws, { event: flow.config.join, data: "echo" });
      };

      console.log(`WebSocket connected at: ${address}`);
    });
  });

  describe("AND GIVEN Client", () => {
    describe("WHEN bouncer is initialized with plugin", () => {
      let send;
      let socket;

      beforeEach(() => {
        flow = new Flow({
          debug: false,
          port: 3003,
          plugins: {
            chat: function (ws, message) {
              send(ws, message);
            },
          },
        });

        config = flow.config;
        send = flow.send;

        socket = new UWebSocket("ws://localhost:3003");
        socket.id = "whatever";
      });

      it("THEN it should work on basic socket.emit message", (done) => {
        socket.onmessage = ({ id, event, data }) => {
          expect(data).toBeTruthy();
          expect(id).toBeTruthy();
          expect(event).toBe(config.join);

          socket.close();

          done();
        };

        socket.onopen = () => {
          socket.emit({ event: config.join, data: "chat" });
        };
      });

      it("THEN it should work on basic socket.io-client-ish.emitEvent message", (done) => {
        socket.onmessage = ({ id, event, data }) => {
          expect(data).toBeTruthy();
          expect(id).toBeTruthy();
          expect(event).toBe(config.join);

          socket.close();

          done();
        };

        socket.onopen = () => {
          socket.emitEvent(config.join, "chat");
        };
      });
    });
  });
});
