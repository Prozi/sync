<h2 align="center">
  @jacekpietal/sync
</h2>

<p align="center">
  <a href="https://badge.fury.io/js/%40jacekpietal%2Fsync"><img src="https://badge.fury.io/js/%40jacekpietal%2Fsync.svg" alt="shield" /></a>
  <a href="https://www.npmjs.com/package/@jacekpietal/sync"><img src="https://img.shields.io/npm/dt/@jacekpietal/sync.svg?style=flat-square" alt="downloads" /></a>
  <a href="https://circleci.com/gh/Prozi/sync"><img src="https://circleci.com/gh/Prozi/sync.svg?style=shield" alt="shield" /></a>
</p>

<br/><br/>

## 1. What is `@jacekpietal/sync`?

- a boilerplate library / repository
- simplifier for creating multiplayer games in javascript + node
- bouncer.js extended class
- an express-like lib with router
- a lib with static files served from a folder (config.folder)
- files served statically are lazily cached out of the box
- observable mouse events broadcaster from front to backend on uwebsockets
- a library with microwebsockets integration
- a lib with a working demo
- a lib with working tests written in jest

## 2. Usage

### Using as a backend framework / library

```javascript
$ yarn add @jacekpietal/sync
$ node
const Flow = require("@jacekpietal/sync/flow");
const flow = new Flow({ debug: true, folder: '../' });
```

### Running example (multiplayer \$joystick)

```bash
$ yarn add @jacekpietal/sync
$ cd node_modules
$ yarn && yarn start
```

### Output of any of above is:

```javascript
sync 🏄 Starts with config: {
  LOGO: 'sync 🏄',
  port: 8080,
  join: '/join',
  leave: '/leave',
  plugins: { joystick: [Function: chat] },
  idConfig: { lang: 'english', len: 5 },
  debug: true
}
sync 🏄 Listens on port 8080
```

- this created a `joystick` `plugin` (websocket room)
- with `bouncer` listening on port `8080`
- with `express`-like router
- with `socket.io`-like wrapper
- for micro-WebSocket as ws handler

### Example (multiplayer joystick preview)

```javascript
"use strict";

import Game from "@jacekpietal/sync/game";
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

  // any change on the game joystick
  // will emit the joystick event to ws server
  game.subject$.subscribe(({ event, data }) => {
    ws.emitEvent(event, data);
  });
};
```

### The code should explain itself, read this test if nothing else:

- [flow.spec.js](lib/flow.spec.js)
- [game.spec.js](lib/game.spec.js)

## 3. Tests

```bash
$ yarn test
```

- runs `jest` tests, also on `circleci`.

| Test Suites:         | 2 passed, 2 total       |
| :------------------- | :---------------------- |
| Tests:               | 10 passed, 10 total     |
| Snapshots:           | 0 total                 |
| Time:                | 2.301 s, estimated 20 s |
| Ran all test suites. |
| Done in 2.83s.       |

## 4. Installation

- `yarn add @jacekpietal/sync --save`

### Documentation

- It is a maintained work in progress.

- Clone this repository and check out tests and demo to get the hang of it.

- Better yet, read the docs, and the `bouncer.js` docs then use as a framework.

- Star if you like.

## 5. License

- Creative Commons Attribution 4.0 International.

- Just write somewhere in your app that you used this free library. It may be just a developer readme file.
