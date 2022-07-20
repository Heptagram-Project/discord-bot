import { EmbedBuilder } from "discord.js";
import { connect } from "mongoose";

import { Heptagram } from "../interfaces/Heptagram";
import { heptagramErrorHandler } from "../modules/heptagramErrorHandler";

/**
 * Instantiates the database connection.
 *
 * @param {Heptagram} Heptagram's Discord instance.
 * @returns {boolean} True if the connection was successful.
 */
export const connectDatabase = async (
  Heptagram: Heptagram
): Promise<boolean> => {
  try {
    await connect(Heptagram.configs.mongoUri);

    const databaseEmbed = new EmbedBuilder();
    databaseEmbed.setTitle("Database connected!");
    databaseEmbed.setDescription(
      `${
        Heptagram.user?.username || "Heptagram"
      } has connected to its database.`
    );
    databaseEmbed.setTimestamp();
    databaseEmbed.setColor(Heptagram.colors.success);
    await Heptagram.debugHook.send({
      embeds: [databaseEmbed],
    });

    return true;
  } catch (err) {
    await heptagramErrorHandler(Heptagram, "database connection", err);
    return false;
  }
};
