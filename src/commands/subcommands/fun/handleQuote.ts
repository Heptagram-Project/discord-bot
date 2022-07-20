import axios from "axios";
import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { Quote } from "../../../interfaces/commands/fun/Quote";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";

/**
 * Generates an embed with a random quote.
 *
 * @param Heptagram
 * @param interaction
 */
export const handleQuote: CommandHandler = async (
  Heptagram,
  interaction
): Promise<void> => {
  try {
    const quote = await axios.get<Quote>(
      `https://api.heptagrambotproject.com/v4/quotes`,
      {
        headers: {
          Authorization: "Bearer " + Heptagram.tokens.heptagramApiToken,
        },
      }
    );

    if (!quote.data || quote.status !== 200) {
      await interaction.reply({
        content: "Something went wrong while fetching a quote.",
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(Heptagram.colors.default)
      .setTitle("Here is a random quote for you!")
      .setDescription(`"${quote.data.quote}"\n-- ${quote.data.author}`)
      .setTimestamp()
      .setFooter({
        text: `This command uses our first party API!`,
        iconURL: `${Heptagram.user?.avatarURL()}`,
      });

    await interaction.reply({ embeds: [embed] });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "quote command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Heptagram, "quote", errorId)],
    });
  }
};
