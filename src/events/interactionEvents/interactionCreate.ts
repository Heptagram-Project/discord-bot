import { Interaction } from "discord.js";

import { Heptagram } from "../../interfaces/Heptagram";
import { commandListener } from "../../listeners/commandListener";
import { usageListener } from "../../listeners/usageListener";
import { heptagramErrorHandler } from "../../modules/heptagramErrorHandler";

/**
 * Processes logic when a new interaction is created.
 *
 * @param {Heptagram} Heptagram's Discord instance.
 * @param {Interaction} interaction The interaction payload received from Discord.
 */
export const interactionCreate = async (
  Heptagram: Heptagram,
  interaction: Interaction
): Promise<void> => {
  try {
    Heptagram.pm2.metrics.events.mark();

    if (interaction.isChatInputCommand()) {
      const target = Heptagram.commands.find(
        (el) => el.data.name === interaction.commandName
      );
      if (!target) {
        interaction.reply({
          content: "Command not found.",
        });
        return;
      }
      if (!interaction.guildId || !interaction.guild) {
        await interaction.reply({
          content: "You must be in a server to use this command.",
        });
        return;
      }

      await commandListener.run(Heptagram, interaction);
      await target.run(Heptagram, interaction);
      await usageListener.run(Heptagram, interaction);
    }
  } catch (err) {
    await heptagramErrorHandler(Heptagram, "interaction create event", err);
  }
};
