import axios from "axios";
import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";

/**
 * Generates an embed with eaither heads or tails
 */
export const handleCoinflip: CommandHandler = async (
  Heptagram,
  interaction
): Promise<void> => {
  try {
    const coinflipResult = await axios.get<boolean>(
      `https://api.heptagrambotproject.com/v4/coinflip`,
      {
        headers: {
          Authorization: "Bearer " + Heptagram.tokens.heptagramApiToken,
        },
      }
    );

    const embed = new EmbedBuilder()
      .setColor(Heptagram.colors.default)
      .setTitle("A coin was flipped..")
      .setDescription(`The coin landed on \`${coinflipResult.data}\``)
      .setTimestamp()
      .setFooter({
        text: `This command uses our first party API! Find out more about it at https://heptagrambotproject.com/api`,
        iconURL: `${Heptagram.user?.avatarURL()}`,
      });

    await interaction.reply({ embeds: [embed] });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "coinflip command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Heptagram, "coinflip", errorId)],
    });
  }
};
