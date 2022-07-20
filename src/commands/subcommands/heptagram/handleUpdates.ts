import {
  ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

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

    const updateEmbed = new EmbedBuilder();
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

    const changelogEmbed = new EmbedBuilder();
    changelogEmbed.setTitle("Changelog:");
    changelogEmbed.setDescription(changelog);
    changelogEmbed.setColor(Heptagram.colors.default);
    changelogEmbed.setFooter({
      text: `Message sent by Heptagram || ${Heptagram.version}`,
      iconURL: `${Heptagram.user?.avatarURL()}`,
    });

    const button = new ButtonBuilder()
      .setLabel("View Full Changelog")
      .setStyle(ButtonStyle.Link)
      .setURL(changelogLink);

    const row = new ActionRowBuilder().addComponents([button]);
    await interaction.reply({
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
    await interaction.reply({
      embeds: [errorEmbedGenerator(Heptagram, "updates", errorId)],
    });
  }
};
