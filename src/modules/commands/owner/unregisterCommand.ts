import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Message, EmbedBuilder } from "discord.js";

import { CommandData } from "../../../interfaces/commands/CommandData";
import { Heptagram } from "../../../interfaces/Heptagram";
import { heptagramErrorHandler } from "../../heptagramErrorHandler";

/**
 * Owner-only module to unregister a command.
 *
 * @param {Heptagram} Heptagram's discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const unregisterCommand = async (
  Heptagram: Heptagram,
  message: Message
) => {
  try {
    const [, , target] = message.content.split(" ");

    const targetCommand = Heptagram.commands.find(
      (el) => el.data.name === target
    );

    if (!targetCommand) {
      await message.reply("I can't find that command.");
      return;
    }

    const rest = new REST({ version: "9" }).setToken(Heptagram.configs.token);

    const commands: CommandData[] = (await rest.get(
      Routes.applicationCommands(Heptagram.configs.id)
    )) as CommandData[];

    const command = commands.find((el) => el.name === targetCommand.data.name);

    if (!command) {
      await message.reply("That command does not look like it's registered.");
      return;
    }

    await rest.delete(
      `${Routes.applicationCommands(Heptagram.configs.id)}/${command.id}`
    );

    const confirm = new EmbedBuilder();
    confirm.setTitle(`${command.name} as been unregistered.`);
    confirm.setDescription(command.description);

    if (command.options) {
      for (const option of command.options) {
        confirm.addFields({
          name: option.name,
          value: option.description,
          inline: true,
        });
      }
    }

    await message.reply({ embeds: [confirm] });
    await Heptagram.debugHook.send(
      `Hey <@!${Heptagram.configs.ownerId}>, the ${command.name} command was unregistered.`
    );
  } catch (err) {
    await heptagramErrorHandler(
      Heptagram,
      "unregister command",
      err,
      message.guild?.name,
      message
    );
  }
};
