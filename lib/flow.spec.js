"use strict";

const { last } = require("rxjs/operators");
const { Flow } = require("./flow");

describe("GIVEN Flow", () => {
  let flow;
  let config;

  beforeEach(() => {
    config = {};
  });

  it("THEN it initializes correctly with config", () => {
    flow = new Flow(config);
    expect(flow).toBeInstanceOf(Flow);
  });

  it("THEN it initializes correctly without config", () => {
    flow = new Flow();
    expect(flow).toBeInstanceOf(Flow);
  });
});
