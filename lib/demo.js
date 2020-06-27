"use strict";

import { Flow } from "./flow";

window.flow = new Flow();

window.flow.subject$.subscribe(({ event, data }) => {
  document.getElementsByTagName("pre")[0].innerText = JSON.stringify(
    { event, data },
    null,
    2,
  );
});
