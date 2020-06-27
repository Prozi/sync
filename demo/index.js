"use strict";

import Flow from "../";

global.document = global.document || {
  addEventListener() {},
};

global.window = global.window || {};

window.flow = new Flow(null, {});
