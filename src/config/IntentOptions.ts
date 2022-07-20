import { GatewayIntentBits, Partials } from "discord.js";

export const IntentOptions = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.GuildBans,
  GatewayIntentBits.GuildEmojisAndStickers,
  GatewayIntentBits.GuildInvites,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions,
];

export const PartialsOptions = [
  Partials.Message,
  Partials.Channel,
  Partials.Reaction,
];
