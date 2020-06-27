"use strict";

import { Flow } from "./flow";

window.flow = new Flow();

window.flow.joystick$.subscribe(({ data }) => {
  console.log(data);
});
