import { EmbedBuilder } from "discord.js";
import moment from "moment";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";

/**
 * Generates an embed with server info.
 */
export const handleServerInfo: CommandHandler = async (
  Heptagram,
  interaction
): Promise<void> => {
  try {
    if (!interaction.guild) {
      throw new Error("This command can only be used in a server.");
    }

    const roles = interaction?.guild?.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString());
    const members = interaction.guild.members.cache;
    const channels = interaction.guild.channels.cache;
    const emojis = interaction.guild.emojis.cache;
    const owner = await interaction.guild.fetchOwner();

    const generalEmbed = new EmbedBuilder()
      .setColor(Heptagram.colors.default)
      .setThumbnail(`${interaction?.guild?.iconURL()}`)
      .addFields([
        { name: "**Name:**", value: `${interaction.guild.name}`, inline: true },
        {
          name: "**Guild ID:**",
          value: `${interaction.guild.id}`,
          inline: true,
        },
        { name: "**Owner:**", value: `${owner} (${owner.id})`, inline: true },
        {
          name: "**Boost Tier:**",
          value: `${
            interaction.guild.premiumTier
              ? `Tier ${interaction.guild.premiumTier}`
              : "None"
          }`,
          inline: true,
        },
        {
          name: "**Time Created:**",
          value: `${moment(interaction.guild.createdTimestamp).format(
            "LT"
          )} ${moment(interaction.guild.createdTimestamp).format(
            "LL"
          )} [${moment(interaction.guild.createdTimestamp).fromNow()}]`,
          inline: true,
        },
      ])
      .addFields([
        { name: "**Role Count:**", value: `${roles.length}`, inline: true },
        { name: "**Emoji Count:**", value: `${emojis.size}`, inline: true },
        {
          name: "**Humans:**",
          value: `${members.filter((member) => !member.user.bot).size}`,
          inline: true,
        },
        {
          name: "**Bots:**",
          value: `${members.filter((member) => member.user.bot).size}`,
          inline: true,
        },
        {
          name: "**Text Channels:**",
          value: `${
            channels.filter((channel) => channel.type === "GUILD_TEXT").size
          }`,
          inline: true,
        },
        {
          name: "**Voice Channels:**",
          value: `${
            channels.filter((channel) => channel.type === "GUILD_VOICE").size +
            channels.filter((channel) => channel.type === "GUILD_STAGE_VOICE")
              .size
          }`,
          inline: true,
        },
      ])
      .setTimestamp()
      .setFooter({
        text: `Message sent by Heptagram || ${Heptagram.version}`,
        iconURL: `${Heptagram.user?.avatarURL()}`,
      });

    interaction.reply({ embeds: [generalEmbed] });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "serverinfo command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Heptagram, "serverinfo", errorId)],
    });
  }
};
