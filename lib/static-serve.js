"use strict";

import fs from "fs";
import path from "path";
import Later from "latermom";
import mime from "mime-types";

const defaultCache = new Later((address) => {
  try {
    return {
      body: fs.readFileSync(address),
      header: `Content-type: ${mime.contentType(address.split("/").pop())}`,
    };
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
export function staticServe(config, res, req, cache = defaultCache) {
  const source = req.getUrl();
  const query = req.getQuery();

  const target = source.replace(/\/+/g, "/");
  const params = query ? `?${query}` : "";

  if (target.length !== source.length) {
    console.log(301, source);
    redirect(res, req, target);
  } else {
    const address = getAddress(config, target);
    const cached = cache.get(address);

    if (cached instanceof Error) {
      if (target.endsWith("/")) {
        console.log(404, address);
        redirect(res, req, `/${params}`);
      } else {
        console.log(301, address);
        redirect(res, req, `${target}/${params}`);
      }
    } else {
      console.log(200, address);
      res.writeHeader(cached.header);
      res.end(cached.body);
    }
  }
}
