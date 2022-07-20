import { CommandInteraction } from "discord.js";

import CommandCountModel from "../database/models/CommandCountModel";
import { Heptagram } from "../interfaces/Heptagram";
import { heptagramErrorHandler } from "../modules/heptagramErrorHandler";

/**
 * Tracks command usage on a server basis, along with updates
 * the server's name.
 *
 * Note - this almost follows the traditional listener type,
 * except takes in the interaction as the `runs`'s second parameter.
 */
export const commandListener = {
  name: "Command Listener",
  description: "Tracks command usage on a server basis",
  run: async (
    Heptagram: Heptagram,
    interaction: CommandInteraction
  ): Promise<void> => {
    try {
      const { guild } = interaction;
      if (!guild) {
        return;
      }

      await CommandCountModel.findOneAndUpdate(
        { serverId: guild.id },
        {
          $inc: { commandUses: 1 },
          $set: { serverName: guild.name, serverAvatar: guild.iconURL() },
        },
        {
          upsert: true,
        }
      ).exec();
    } catch (err) {
      await heptagramErrorHandler(
        Heptagram,
        "command listener",
        err,
        interaction.guild?.name
      );
    }
  },
};
