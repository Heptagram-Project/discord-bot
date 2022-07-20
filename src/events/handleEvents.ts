import { Heptagram } from "../interfaces/Heptagram";

import { disconnect } from "./clientEvents/disconnect";
import { ready } from "./clientEvents/ready";
import { guildCreate } from "./guildEvents/guildCreate";
import { guildDelete } from "./guildEvents/guildDelete";
import { interactionCreate } from "./interactionEvents/interactionCreate";
import { messageCreate } from "./messageEvents/messageCreate";
import { shardError } from "./shardEvents/shardError";
import { shardReady } from "./shardEvents/shardReady";
import { threadCreate } from "./threadEvents/threadCreate";

/**
 * Root level function for loading all of the event listeners. Attaches
 * all of the Discord.js event listeners to Heptagram's custom handlers.
 *
 * @param {Heptagram} Heptagram Heptagram's Client instance.
 */
export const handleEvents = (Heptagram: Heptagram): void => {
  Heptagram.on("shardReady", async (shard) => {
    await shardReady(Heptagram, shard);
  });
  Heptagram.on("shardError", async (error, shard) => {
    await shardError(Heptagram, error, shard);
  });

  Heptagram.on("messageCreate", async (message) => {
    await messageCreate(Heptagram, message);
  });

  Heptagram.on("ready", async () => {
    await ready(Heptagram);
  });
  Heptagram.on("disconnect", async () => {
    await disconnect(Heptagram);
  });

  Heptagram.on("threadCreate", async (thread) => {
    await threadCreate(Heptagram, thread);
  });

  Heptagram.on("interactionCreate", async (interaction) => {
    await interactionCreate(Heptagram, interaction);
  });

  Heptagram.on("guildCreate", async (guild) => {
    await guildCreate(Heptagram, guild);
  });

  Heptagram.on("guildDelete", async (guild) => {
    await guildDelete(Heptagram, guild);
  });
};
