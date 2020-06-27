"use strict";

import { filter } from "rxjs/operators";
import { Flow } from "./flow";
import { GameEvents } from "./game";

window.flow = new Flow();

window.flow.game.subject$
  .pipe(filter(({ event }) => event === GameEvents.JOYSTICK))
  .subscribe(({ data }) => {
    console.log(data.joystick);
  });
