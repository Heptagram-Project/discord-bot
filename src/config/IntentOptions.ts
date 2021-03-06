import { IntentsString, PartialTypes } from "discord.js";

export const IntentOptions: IntentsString[] = [
  "GUILDS",
  "DIRECT_MESSAGES",
  "GUILD_BANS",
  "GUILD_EMOJIS_AND_STICKERS",
  "GUILD_INVITES",
  "GUILD_MESSAGES",
  "GUILD_MESSAGE_REACTIONS",
];

export const PartialsOptions: PartialTypes[] = [
  "MESSAGE",
  "CHANNEL",
  "REACTION",
];
