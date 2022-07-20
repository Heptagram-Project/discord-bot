import { CommandInteraction } from "discord.js";

import UsageModel from "../database/models/UsageModel";
import { Heptagram } from "../interfaces/Heptagram";
import { heptagramErrorHandler } from "../modules/heptagramErrorHandler";

/**
 * Tracks anonymous slash command usage to see which are popular
 * and which are unused.
 */
export const usageListener = {
  name: "usage",
  description: "Tracks command usage.",
  run: async (
    Heptagram: Heptagram,
    interaction: CommandInteraction
  ): Promise<void> => {
    try {
      const command = interaction.commandName;
      const subcommand = interaction.isChatInputCommand();

      const data =
        (await UsageModel.findOne({ command, subcommand })) ||
        (await UsageModel.create({ command, subcommand, uses: 0 }));

      data.uses++;
      await data.save();
    } catch (err) {
      await heptagramErrorHandler(
        Heptagram,
        "thanks listener",
        err,
        interaction.guild?.name
      );
    }
  },
};
