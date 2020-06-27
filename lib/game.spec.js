"use strict";

const { last } = require("rxjs/operators");
const { Game, GameEvents } = require("./game");

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
      config.keyboard = { name: "mockKeyboard" };
    });

    it("THEN 'UPDATED' event is emitted with payload", (done) => {
      game = new Game(config);
      game.subject$.subscribe(({ event, data }) => {
        expect(event).toBe(GameEvents.UPDATED);
        expect(data).toStrictEqual(config.keyboard);
        done();
      });
    });
  });
});
