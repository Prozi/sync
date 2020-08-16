"use strict";

import { Game } from "./game";
import UWebSocket from "@jacekpietal/bouncer.js/client.js";

const game = new Game();
const pre = document.getElementsByTagName("pre")[0];
const state = {};
const address = `ws://${location.hostname}:8080`;
const ws = new UWebSocket(address);

ws.on("*", ({ id, event, data }) => {
  if (event === "/leave") {
    // cleanup
    delete state[id];
  } else {
    // echo on screen
    state[id] = { event, data };
  }
  // update render
  pre.innerText = JSON.stringify(state, null, 2);
});

ws.onopen = () => {
  // this is possible now
  // ws.emitEvent is like socket.io ws.emit("event", { data })
  ws.emitEvent("/join", "joystick");

  // this is possible now
  // any change on the game joystick
  // will emit the joystick event to ws server
  game.subject$.subscribe(({ event, data }) => {
    ws.emitEvent(event, data);
  });
};
