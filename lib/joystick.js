"use strict";

import { Subject } from "rxjs";

export class JoyStick {
  constructor() {
    this.pivot = { x: 0.5, y: 0.5 };
    this.x = 0;
    this.y = 0;
    this.fire = false;
    this.subject$ = new Subject();
  }

  getEvents() {
    return {
      contextmenu: (event) => {
        event.preventDefault();
      },
      pointermove: (event) => {
        this.joystickEvent(event, this.fire);
      },
      pointerdown: (event) => {
        this.joystickEvent(event, true);
      },
      pointerup: (event) => {
        this.joystickEvent(event, false);
      },
      dragmove: (event) => {
        this.joystickEvent(event, this.fire);
      },
      dragstart: (event) => {
        this.joystickEvent(event, true);
      },
      dragend: (event) => {
        this.joystickEvent(event, false);
      },
      touchmove: (event) => {
        this.joystickEvent(event.touches[0], this.fire);
      },
      touchstart: (event) => {
        this.joystickEvent(event.touches[0], true);
      },
      touchend: (event) => {
        this.joystickEvent(event.changedTouches[0], false);
      },
    };
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      fire: this.fire,
    };
  }

  joystickEvent(event, fire) {
    if (event instanceof Event) {
      event.preventDefault();
    }

    const json = this.toJSON();

    this.x = event.pageX / window.innerWidth - this.pivot.x;
    this.y = event.pageY / window.innerHeight - this.pivot.y;

    this.fire = fire;

    const data = this.toJSON();

    if (JSON.stringify(json) !== JSON.stringify(data)) {
      this.subject$.next(data);
    }
  }
}

JoyStick.EVENT = "[Game JoyStick] Update";
