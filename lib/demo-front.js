"use strict";

import { Game } from "./game";
import UWebSocket from "@jacekpietal/bouncer.js/client";

window.game = new Game();
window.UWebSocket = UWebSocket;
