"use strict";

import { filter } from "rxjs/operators";
import { Game, GameEvents } from "./game";

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

    it("THEN 'UPDATE' event is emitted with payload", (done) => {
      game = new Game(config);
      game.subject$
        .pipe(filter(({ data }) => data.keyboard))
        .subscribe(({ event, data }) => {
          expect(event).toBe(GameEvents.UPDATE);
          expect(data.keyboard).toBe(config.keyboard);
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
        .pipe(filter(({ event }) => event === GameEvents.BEFORE_UPDATE))
        .subscribe(({ event, data }) => {
          expect(event).toBe(GameEvents.BEFORE_UPDATE);
          expect(data).toBe({ keyboard: config.keyboard });
        });

      game.subject$
        .pipe(filter(({ event }) => event === GameEvents.UPDATE))
        .subscribe(({ event, data }) => {
          expect(event).toBe(GameEvents.UPDATE);
          expect(data).toStrictEqual({ keyboard: null });
          done();
        });

      game.useKeyboard(null);
    });
  });
});
