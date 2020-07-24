<h2 align="center">
  @jacekpietal/sync
</h2>

<p align="center">
  <a href="https://badge.fury.io/js/%40jacekpietal%2Fsync"><img src="https://badge.fury.io/js/%40jacekpietal%2Fsync.svg" alt="shield" /></a>
  <a href="https://www.npmjs.com/package/@jacekpietal/sync"><img src="https://img.shields.io/npm/dt/@jacekpietal/sync.svg?style=flat-square" alt="downloads" /></a>
</p>

## Introduction

`@jacekpietal/sync` is:

- a boilerplate library / repository.
- simplifier for creating multiplayer games in javascript + node.
- a library with websockets integration (microwebsockets actually written in c++)
- a lib with a working demo.
- a lib with working tests written in jest.

## Readme

```bash
$ yarn start
Start with this.config {
  LOGO: 'bouncer 🐻',
  port: 8080,
  join: '/join',
  leave: '/leave',
  createSocketId: [Function: simpleId],
  plugins: { echo: [Function: bound echo] },
  debug: true
}
bouncer 🐻 Listens on port 8080
```

- this will create a chat on 8080 port
- with `express`-like router
- and `socket.io`-like uWebSocket

### The code should explain itself, read this test if nothing else:

[flow.spec.js](lib/flow.spec.js)

## Tests

<a href="https://circleci.com/gh/Prozi/sync">
  <img src="https://circleci.com/gh/Prozi/sync.svg?style=shield" alt="shield" />
</a>

| Test Suites:         | 2 passed, 2 total       |
| -------------------- | :---------------------- |
| Tests:               | 8 passed, 8 total       |
| Snapshots:           | 0 total                 |
| Time:                | 2.301 s, estimated 20 s |
| Ran all test suites. |
| Done in 2.83s.       |

## Installation

- `yarn add @jacekpietal/sync --save`

## Documentation

- it is a maintained work in progress.

- clone this repository and check out tests and demo to get the hang of it.

## License

- Creative Commons Attribution 4.0 International.

- just write somewhere in your app that you used this free library.
