"use strict";

import { Flow } from "./lib/flow";

const flow = new Flow(null, {
  debug: true,
  plugins: {
    echo: function (ws, { id, event, data }) {
      flow.api.broadcast(ws, { id, event, data });
    },
  },
});

export default flow;
