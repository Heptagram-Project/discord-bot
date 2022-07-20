import {
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { getCounts } from "../../../modules/getCounts";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";

/**
 * Generates an embed containing information about Heptagram.
 */
export const handleAbout: CommandHandler = async (Heptagram, interaction) => {
  try {
    const { guilds, members, commands } = getCounts(Heptagram);
    const aboutEmbed = new EmbedBuilder();
    aboutEmbed.setColor(Heptagram.colors.default);
    aboutEmbed.setTitle("About Heptagram");
    aboutEmbed.setDescription(
      "The open-source & multipurpose Discord bot with the goal to be the single needed bot for any server."
    );
    aboutEmbed.addFields(
      {
        name: "Version:",
        value: Heptagram.version || "unknown version",
        inline: true,
      },
      { name: "Date Created:", value: "Mar 26, 2021", inline: true },
      { name: "Number of Guilds:", value: guilds.toString(), inline: true },
      { name: "Number of Members:", value: members.toString(), inline: true },
      { name: "Number of Commands:", value: commands.toString(), inline: true }
    );
    aboutEmbed.setFooter({
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
      .setLabel("GitHub Repository")
      .setStyle(ButtonStyle.Link)
      .setURL("https://github.com/heptagram-bot-project/discord-bot");

    const row = new ActionRowBuilder().addComponents([
      supportServerButton,
      inviteButton,
      codeButton,
    ]);

    await interaction.reply({ embeds: [aboutEmbed], components: [row] });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "about command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Heptagram, "about", errorId)],
    });
  }
};
