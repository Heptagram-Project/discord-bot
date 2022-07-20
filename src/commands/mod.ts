import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";

import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../modules/heptagramErrorHandler";

import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";
import { handleBan } from "./subcommands/moderation/handleBan";
import { handleKick } from "./subcommands/moderation/handleKick";
import { handleMute } from "./subcommands/moderation/handleMute";
import { handleUnmute } from "./subcommands/moderation/handleUnmute";

const handlers: { [key: string]: CommandHandler } = {
  mute: handleMute,
  unmute: handleUnmute,
  kick: handleKick,
  ban: handleBan,
};

export const mod: Command = {
  data: new SlashCommandBuilder()
    .setName("mod")
    .setDescription("Moderation actions")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("warn")
        .setDescription("Issues a warning to a user.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to warn.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for issuing this warning.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("mute")
        .setDescription("Mutes a user via your configured muted role.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to mute.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("duration")
            .setDescription("The length of time to mute the user.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("unit")
            .setDescription("The unit of time for the duration.")
            .setRequired(true)
            .addChoices(
              { name: "Minutes", value: "minutes" },
              { name: "Hours", value: "hours" },
              { name: "Days", value: "days" },
              { name: "Weeks", value: "weeks" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for muting the user.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("unmute")
        .setDescription("Unmutes a user via your configured muted role.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to unmute.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for unmuting the user.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("kick")
        .setDescription("Kicks a user from the server.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to kick.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for kicking the user.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("ban")
        .setDescription("Bans a user from the server.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to kick.")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("prune")
            .setDescription(
              "The number of days to clean up messages. Set to 0 to not clean messages."
            )
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(7)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for kicking the user.")
            .setRequired(true)
        )
    ),
  run: async (Heptagram, interaction) => {
    try {
      await interaction.deferReply();
      const subcommand = interaction.options.getSubcommand();
      const handler = handlers[subcommand] || handleInvalidSubcommand;
      await handler(Heptagram, interaction);
      Heptagram.pm2.metrics.commands.mark();
    } catch (err) {
      const errorId = await heptagramErrorHandler(
        Heptagram,
        "mod group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.reply({
        embeds: [errorEmbedGenerator(Heptagram, "mod group", errorId)],
      });
    }
  },
};
