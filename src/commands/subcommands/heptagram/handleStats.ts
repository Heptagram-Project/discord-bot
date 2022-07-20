import { DurationFormatter } from "@sapphire/time-utilities";
import { EmbedBuilder, version } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";

const durationFormatter = new DurationFormatter();

/**
 * Show's the bot's stats.
 */
export const handleStats: CommandHandler = async (Heptagram, interaction) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const duration = durationFormatter.format(Heptagram.uptime!);
    const stats = `
    • Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
      2
    )} MB
    • Uptime     :: ${duration}
    • Users      :: ${Heptagram.guilds.cache
      .map((g) => g.memberCount)
      .reduce((a, b) => a + b)
      .toLocaleString()}
    • Servers    :: ${Heptagram.guilds.cache.size.toLocaleString()}
    • Channels   :: ${Heptagram.channels.cache.size.toLocaleString()}
    • Discord.js :: v${version}
    • Node       :: ${process.version}
    • Bot        :: ${Heptagram.version}
    `;

    const embed = new EmbedBuilder()
      .setColor(Heptagram.colors.default)
      .setTitle("Heptagram Statistics")
      .setDescription(stats)
      .setTimestamp()
      .setFooter({
        text: `Message sent by Heptagram || ${Heptagram.version}`,
        iconURL: `${Heptagram.user?.avatarURL()}`,
      });

    await interaction.reply({ embeds: [embed] });
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
