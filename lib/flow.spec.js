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

  it("THEN it initializes correctly with config", () => {
    flow = new Flow(game);
    flow instanceof BouncerJs;
    expect(flow).toBeInstanceOf(Flow);
  });

  it("THEN it initializes correctly without config", () => {
    flow = new Flow();
    expect(flow).toBeInstanceOf(Flow);
  });

  it("THEN it initializes the game", (done) => {
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
