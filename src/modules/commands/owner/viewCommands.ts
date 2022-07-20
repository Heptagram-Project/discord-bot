import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Message, EmbedBuilder } from "discord.js";

import { CommandData } from "../../../interfaces/commands/CommandData";
import { Heptagram } from "../../../interfaces/Heptagram";
import { heptagramErrorHandler } from "../../heptagramErrorHandler";

/**
 * Owner-only module to view the current list of commands.
 *
 * @param {Heptagram} Heptagram's discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const viewCommands = async (Heptagram: Heptagram, message: Message) => {
  try {
    const rest = new REST({ version: "9" }).setToken(Heptagram.configs.token);

    const commands: CommandData[] = (await rest.get(
      Routes.applicationCommands(Heptagram.configs.id)
    )) as CommandData[];

    if (!commands.length) {
      await message.reply("It seems I do not have any commands loaded.");
      return;
    }

    const embed = new EmbedBuilder();
    embed.setTitle("Available Commands");
    embed.setDescription("These are the commands I have loaded.");

    for (const command of commands) {
      embed.addFields({
        name: command.name,
        value:
          command.options?.map((opt) => opt.name).join(", ") ||
          "This command has no options.",
      });
    }

    await message.reply({ embeds: [embed] });
  } catch (err) {
    await heptagramErrorHandler(
      Heptagram,
      "view slash command",
      err,
      message.guild?.name,
      message
    );
  }
};
