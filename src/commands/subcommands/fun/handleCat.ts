import axios from "axios";
import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";

/**
 * Generates an embed with a random cat image.
 */
export const handleCat: CommandHandler = async (
  Heptagram,
  interaction
): Promise<void> => {
  try {
    // x-api-key is required for the cat API
    const catApiResponse = await axios.get(
      "https://api.thecatapi.com/v1/images/search",
      {
        headers: {
          "x-api-key": Heptagram.tokens.catsApiKey,
        },
      }
    );
    const catUrl = catApiResponse.data[0].url;

    const embed = new EmbedBuilder()
      .setColor(Heptagram.colors.default)
      .setTitle("Here is a random cat for you!")
      .setImage(catUrl)
      .setTimestamp()
      .setFooter({
        text: `This message uses an API provided by thecatapi.com`,
        iconURL: catUrl,
      });

    await interaction.reply({ embeds: [embed] });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "cat command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Heptagram, "cat", errorId)],
    });
  }
};
