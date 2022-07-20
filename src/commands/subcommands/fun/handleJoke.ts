import axios from "axios";
import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { Joke } from "../../../interfaces/commands/fun/Joke";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";

/**
 * Generates an embed with a random joke.
 *
 * @param Heptagram
 * @param interaction
 */
export const handleJoke: CommandHandler = async (
  Heptagram,
  interaction
): Promise<void> => {
  try {
    const joke = await axios.get<Joke>(
      `https://api.heptagrambotproject.com/v4/jokes`,
      {
        headers: {
          Authorization: "Bearer " + Heptagram.tokens.heptagramApiToken,
        },
      }
    );

    if (!joke.data || joke.status !== 200) {
      await interaction.reply({
        content: "Something went wrong while fetching a joke.",
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(Heptagram.colors.default)
      .setTitle("Here is a random joke for you!")
      .setDescription(joke.data.joke)
      .setTimestamp()
      .setFooter({
        text: `This command uses our first party API!`,
        iconURL: `${Heptagram.user?.avatarURL()}`,
      });

    await interaction.reply({ embeds: [embed] });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "joke command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Heptagram, "joke", errorId)],
    });
  }
};
