import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";

/**
 * Generates an embed containing information on how to interact with Heptagram,
 * links to the support server, docs, and code.
 */
export const handleHelp: CommandHandler = async (Heptagram, interaction) => {
  try {
    const helpEmbed = new EmbedBuilder();
    helpEmbed.setTitle("Help");
    helpEmbed.setDescription("Here are some ways to interact with Heptagram.");
    helpEmbed.addFields(
      {
        name: "Contact the developer team:",
        value: "Use the `Support Server` button.",
      },
      {
        name: "Access the documentation:",
        value: "Use the `Documentation` button.",
      },
      {
        name: "Source Code:",
        value: "Use the `Source Code` button.",
      },
      {
        name: "Report a bug:",
        value: "Use the `Report a Bug` button.",
      }
    );
    helpEmbed.setFooter({
      text: `Message sent by Heptagram || ${Heptagram.version}`,
      iconURL: `${Heptagram.user?.avatarURL()}`,
    });

    const supportServerButton = new ButtonBuilder()
      .setLabel("Support Server")
      .setStyle(ButtonStyle.Link)
      .setURL("https://links.heptagrambotproject.com/discord");
    const inviteButton = new ButtonBuilder()
      .setLabel("Invite Heptagram")
      .setStyle(ButtonStyle.Link)
      .setURL("https://links.heptagrambotproject.com/invite");
    const codeButton = new ButtonBuilder()
      .setLabel("Source Code")
      .setStyle(ButtonStyle.Link)
      .setURL("https://github.com/heptagram-bot-project/discord-bot");
    const docsButton = new ButtonBuilder()
      .setLabel("Doucmentation")
      .setStyle(ButtonStyle.Link)
      .setURL("https://docs.heptagrambotproject.com");
    const bugButton = new ButtonBuilder()
      .setLabel("Report a bug")
      .setStyle(ButtonStyle.Link)
      .setURL(
        "https://github.com/heptagram-bot-project/discord-bot/issues/new/choose"
      );

    const row = new ActionRowBuilder().addComponents([
      supportServerButton,
      inviteButton,
      codeButton,
      docsButton,
      bugButton,
    ]);

    await interaction.reply({ embeds: [helpEmbed], components: [row] });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "help command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Heptagram, "help", errorId)],
    });
  }
};
