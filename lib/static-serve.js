"use strict";

import fs from "fs";
import path from "path";
import Later from "latermom";

const cache = new Later((address) => {
  try {
    return fs.readFileSync(address);
  } catch (error) {
    return error;
  }
});

/**
 * @param {HttpResponse} res
 * @param {HttpRequest} req
 * @param {string} url
 */
export function redirect(res, req, url = req.getUrl()) {
  res.writeStatus("301");
  res.writeHeader("Location", url);
  res.end();
}

/**
 * @param {string} url
 */
export function getAddress(config, url) {
  const file = path.extname(url) ? url : `${url}index.html`;

  return path.join(config.folder, decodeURIComponent(file));
}

/**
 * @param {HttpResponse} res
 * @param {HttpRequest} req
 * @param {string} url
 */
export function staticServe(config, res, req, url = req.getUrl()) {
  const trim = url.replace(/\/+/g, "/");

  if (trim.length !== url.length) {
    redirect(res, req, trim);
    return;
  }

  const address = getAddress(config, trim);
  const cached = cache.get(address);

  if (cached instanceof Error) {
    if (trim.endsWith("/")) {
      console.log(404, address);
      redirect(res, req, "/");
    } else {
      redirect(res, req, `${trim}/`);
    }
    return;
  }

  console.log(200, address);
  res.end(cached);
  return;
}
