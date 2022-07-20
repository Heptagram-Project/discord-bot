import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";

import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../modules/heptagramErrorHandler";

import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";
import { handlePermissions } from "./subcommands/misc/handlePermissions";

const handlers: { [key: string]: CommandHandler } = {
  permissions: handlePermissions,
};

export const misc: Command = {
  data: new SlashCommandBuilder()
    .setName("misc")
    .setDescription("Miscellaneous commands that do not fit other categories")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("permissions")
        .setDescription(
          "Confirms the bot has the correct permissions in the channel and guild."
        )
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
        "misc group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.reply({
        embeds: [errorEmbedGenerator(Heptagram, "misc group", errorId)],
      });
    }
  },
};
