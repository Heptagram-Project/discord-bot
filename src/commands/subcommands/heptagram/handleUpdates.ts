import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import { nextScheduledRelease } from "../../../config/commands/updatesData";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";
import { getLatestChangelog } from "../../../utils/getLatestChangelog";

/**
 * Generates an embed explaining the new release schedule, and what the update
 * process breaks in terms of lost cache.
 *
 * @param {Heptagram} Heptagram Heptagram's discord instance.
 * @param {Interaction} interaction The interaction object.
 */
export const handleUpdates: CommandHandler = async (Heptagram, interaction) => {
  try {
    const { commitHash: hash } = Heptagram;
    const { changelog, changelogLink } = await getLatestChangelog();

    const updateEmbed = new MessageEmbed();
    updateEmbed.setTitle("Updates");
    updateEmbed.setDescription("Here are the updates since the last release.");
    updateEmbed.addField("New version:", Heptagram.version || "0.0.0");
    updateEmbed.addField("Next release:", nextScheduledRelease);
    updateEmbed.addField(
      "Commit hash:",
      `[${hash.slice(
        0,
        7
      )}](https://github.com/heptagram-bot-project/discord-bot/commit/${hash})`
    );
    updateEmbed.setColor(Heptagram.colors.default);
    updateEmbed.setFooter({
      text: `Message sent by Heptagram || ${Heptagram.version}`,
      iconURL: `${Heptagram.user?.avatarURL()}`,
    });

    const changelogEmbed = new MessageEmbed();
    changelogEmbed.setTitle("Changelog:");
    changelogEmbed.setDescription(changelog);
    changelogEmbed.setColor(Heptagram.colors.default);
    changelogEmbed.setFooter({
      text: `Message sent by Heptagram || ${Heptagram.version}`,
      iconURL: `${Heptagram.user?.avatarURL()}`,
    });

    const button = new MessageButton()
      .setLabel("View Full Changelog")
      .setStyle("LINK")
      .setURL(changelogLink);

    const row = new MessageActionRow().addComponents([button]);
    await interaction.editReply({
      embeds: [updateEmbed, changelogEmbed],
      components: [row],
    });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "updates command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Heptagram, "updates", errorId)],
    });
  }
};
