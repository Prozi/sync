"use strict";

import { filter, first } from "rxjs/operators";
import Game from "./game";

describe("GIVEN Game", () => {
  let game;
  let config;

  beforeEach(() => {
    config = {};
  });

  it("THEN it initializes correctly with config", () => {
    game = new Game(config);
    expect(game).toBeInstanceOf(Game);
  });

  it("THEN it initializes correctly without config", () => {
    game = new Game();
    expect(game).toBeInstanceOf(Game);
  });

  describe("AND keyboard is provided", () => {
    beforeEach(() => {
      config.keyboard = {
        keydown: () => null,
      };
    });

    it("THEN 'CONFIGURED' event is emitted with payload", (done) => {
      game = new Game(config);
      game.subject$.pipe(first()).subscribe(({ event }) => {
        console.log({ event });
        expect(event).toBe(game.EVENTS.CONFIGURED);
        done();
      });
    });
  });

  describe("AND keyboard is provided twice", () => {
    beforeEach(() => {
      config.keyboard = {
        keydown: () => null,
      };
    });

    it("THEN 'BEFORE_UPDATE' event is called once", (done) => {
      game = new Game(config);

      game.subject$
        .pipe(filter(({ event }) => event === game.EVENTS.BEFORE_UPDATE))
        .subscribe(({ event, data }) => {
          expect(event).toBe(game.EVENTS.BEFORE_UPDATE);
          expect(data).toStrictEqual({ keyboard: config.keyboard });
        });

      game.subject$
        .pipe(filter(({ event }) => event === game.EVENTS.UPDATE))
        .subscribe(({ event, data }) => {
          expect(event).toBe(game.EVENTS.UPDATE);
          expect(data).toStrictEqual({ keyboard: null });
          done();
        });

      game.configure({ keyboard: null });
    });
  });
});
