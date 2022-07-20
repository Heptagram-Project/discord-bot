import { MessageActionRow, MessageButton } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";

/**
 * Returns a bit of text and some buttons with the different ways to contact the developer team.
 */
export const handleContact: CommandHandler = async (Heptagram, interaction) => {
  try {
    const discordButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel("Discord")
      .setURL("https://links.heptagrambotproject.com/discord");
    const githubButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel("GitHub")
      .setURL("https://github.com/heptagram-bot-project/discord-bot");

    const row = new ActionRowBuilder().addComponents([
      discordButton,
      githubButton,
    ]);
    await interaction.reply({
      content: "Contact the developer team.",
      components: [row],
    });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "contact command",
      err,
      interaction.guild?.name
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Heptagram, "contact", errorId)],
    });
  }
};
