import io from "@pm2/io";

import { Heptagram } from "../interfaces/Heptagram";

import { heptagramLogHandler } from "./heptagramLogHandler";

/**
 * Module to load the PM2 config and attach it to Heptagram.
 *
 * @param {Heptagram} Heptagram's Discord instance.
 * @returns {boolean} True if PM2 configs were mounted successfully.
 */
export const loadPM2 = (Heptagram: Heptagram): boolean => {
  try {
    Heptagram.pm2 = {
      client: io,
      metrics: {
        events: io.meter({ name: "Gateway Events Received", id: "events" }),
        commands: io.meter({ name: "Commands Received", id: "commands" }),
        errors: io.meter({ name: "Errors Triggered", id: "errors" }),
        guilds: io.gauge({ name: "Guild Count", id: "guilds" }),
        users: io.gauge({ name: "User Count", id: "users" }),
      },
    };
    io.init();
    return true;
  } catch (err) {
    heptagramLogHandler.log("error", err);
    return false;
  }
};
