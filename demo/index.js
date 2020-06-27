"use strict";

import Flow from "../index.js";

global.document = global.document || {
  addEventListener() {},
};

global.window = global.window || {};

window.flow = new Flow(null, {});
