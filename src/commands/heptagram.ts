import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";

import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../modules/heptagramErrorHandler";

import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";
import { handleAbout } from "./subcommands/heptagram/handleAbout";
import { handleContact } from "./subcommands/heptagram/handleContact";
import { handleHelp } from "./subcommands/heptagram/handleHelp";
import { handleInvite } from "./subcommands/heptagram/handleInvite";
import { handlePing } from "./subcommands/heptagram/handlePing";
import { handleStats } from "./subcommands/heptagram/handleStats";
import { handleUpdates } from "./subcommands/heptagram/handleUpdates";
import { handleUptime } from "./subcommands/heptagram/handleUptime";

const handlers: { [key: string]: CommandHandler } = {
  ping: handlePing,
  help: handleHelp,
  about: handleAbout,
  invite: handleInvite,
  uptime: handleUptime,
  updates: handleUpdates,
  contact: handleContact,
  stats: handleStats,
};

export const heptagram: Command = {
  data: new SlashCommandBuilder()
    .setName("heptagram")
    .setDescription("Returns the uptime of the bot.")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("ping")
        .setDescription("Returns the ping of the bot")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("help")
        .setDescription("Shows information on how to use the bot.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("about")
        .setDescription("Shows information about Heptagram.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("invite")
        .setDescription("Provides a link to invite Heptagram to your server.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("uptime")
        .setDescription("Shows how long Heptagram has been online.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("updates")
        .setDescription("Shows the latest updates to Heptagram.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("contact")
        .setDescription("Offers links to contact the development team.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("stats")
        .setDescription("Shows statistics about the bot.")
    ),
  run: async (Heptagram, interaction) => {
    try {
      await interaction.deferReply();

      const subCommand = interaction.options.getSubcommand();
      const handler = handlers[subCommand] || handleInvalidSubcommand;
      await handler(Heptagram, interaction);
      Heptagram.pm2.metrics.commands.mark();
    } catch (err) {
      const errorId = await heptagramErrorHandler(
        Heptagram,
        "heptagram group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.reply({
        embeds: [errorEmbedGenerator(Heptagram, "heptagram group", errorId)],
      });
    }
  },
};
