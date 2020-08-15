<h2 align="center">
  @jacekpietal/sync
</h2>

<p align="center">
  <a href="https://badge.fury.io/js/%40jacekpietal%2Fsync"><img src="https://badge.fury.io/js/%40jacekpietal%2Fsync.svg" alt="shield" /></a>
  <a href="https://www.npmjs.com/package/@jacekpietal/sync"><img src="https://img.shields.io/npm/dt/@jacekpietal/sync.svg?style=flat-square" alt="downloads" /></a>
  <a href="https://circleci.com/gh/Prozi/sync"><img src="https://circleci.com/gh/Prozi/sync.svg?style=shield" alt="shield" /></a>
</p>

<br/><br/>

## Introduction

`@jacekpietal/sync` is:

- a boilerplate library / repository.
- simplifier for creating multiplayer games in javascript + node.
- bouncer.js extended class,
- library having static files serve function that takes folder path as argument 
- that has served files lazy cache implemented.
- observable mouse events broadcaster from front to backend on uwebsockets,
- a library with microwebsockets integration,
- a lib with a working demo.
- a lib with working tests written in jest.

## Readme

```bash
$ yarn start # running example script yields this output below:
```

```javascript
sync 🏄 Starts with config: {
  LOGO: 'sync 🏄',
  port: 8080,
  join: '/join',
  leave: '/leave',
  plugins: { chat: [Function: chat] },
  idConfig: { lang: 'english', len: 5 },
  debug: true
}
sync 🏄 Listens on port 8080
```

- this will create a chat on 8080 port
- with `express`-like router
- and `socket.io`-like uWebSocket

### Details

- `node -r esm`

```javascript
import { Flow } from "@jacekpietal/sync";

const flow = new Flow({ debug: true });

console.log(flow);
```

### The code should explain itself, read this test if nothing else:

- [flow.spec.js](lib/flow.spec.js)
- `import { Flow, Game, staticServe } from "@jacekpietal/sync"`

## Tests

```bash
$ yarn test
```

- runs `jest` tests, also on `circleci`.

| Test Suites:         | 2 passed, 2 total       |
| :------------------- | :---------------------- |
| Tests:               | 8 passed, 8 total       |
| Snapshots:           | 0 total                 |
| Time:                | 2.301 s, estimated 20 s |
| Ran all test suites. |
| Done in 2.83s.       |

```bash
$ yarn start
```

- compiles and runs chat example on 8080 port.

## Installation

- `yarn add @jacekpietal/sync --save`

## Documentation

- it is a maintained work in progress.

- clone this repository and check out tests and demo to get the hang of it.

## License

- Creative Commons Attribution 4.0 International.

- just write somewhere in your app that you used this free library.
