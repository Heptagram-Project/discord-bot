import { MessageActionRow, MessageButton, EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";

/**
 * Generates an embed containing a link to invite Heptagram. The link is handled
 * by the Heptagram Project domain, to ensure it is up to date with permission and scope
 * changes.
 */
export const handleInvite: CommandHandler = async (Heptagram, interaction) => {
  try {
    const inviteEmbed = new EmbedBuilder();
    inviteEmbed.setTitle("Invite Heptagram");
    inviteEmbed.setDescription(
      "Use the `Invite Heptagram` button to get the invite link"
    );
    inviteEmbed.setColor(Heptagram.colors.default);
    inviteEmbed.setFooter({
      text: `Message sent by Heptagram || ${Heptagram.version}`,
      iconURL: `${Heptagram.user?.avatarURL()}`,
    });
    inviteEmbed.setTimestamp();

    const inviteButton = new ButtonBuilder()
      .setLabel("Invite Heptagram")
      .setStyle(ButtonStyle.Link)
      .setURL("https://links.heptagrambotproject.com/invite");

    const row = new ActionRowBuilder().addComponents([inviteButton]);

    await interaction.reply({ embeds: [inviteEmbed], components: [row] });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "invite command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Heptagram, "invite", errorId)],
    });
  }
};
