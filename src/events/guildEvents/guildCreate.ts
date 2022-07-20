import { Guild, EmbedBuilder } from "discord.js";

import { Heptagram } from "../../interfaces/Heptagram";

/**
 * Generates an embed when Heptagram joins a guild and sends it to the debug hook.
 *
 * @param {Heptagram} Heptagram Heptagram's Discord instance.
 * @param {Guild} guild The guild object for the server Heptagram joined.
 */
export const guildCreate = async (
  Heptagram: Heptagram,
  guild: Guild
): Promise<void> => {
  const owner = await guild.members.fetch(guild.ownerId);
  const guildCreateEmbed = new EmbedBuilder();
  guildCreateEmbed.setTitle(
    `${Heptagram.user?.username || "Heptagram"} has joined a new guild`
  );
  guildCreateEmbed.addFields(
    {
      name: "Guild Name",
      value: guild.name,
      inline: true,
    },
    {
      name: "Guild Owner",
      value: owner?.user.username || "No owner data available.",
      inline: true,
    },
    {
      name: "Guild ID",
      value: guild.id,
      inline: true,
    },
    {
      name: "Guild Owner ID",
      value: guild.ownerId || "No owner data available",
      inline: true,
    }
  );

  guildCreateEmbed.setColor(Heptagram.colors.success);
  guildCreateEmbed.setTimestamp();

  await Heptagram.debugHook.send({ embeds: [guildCreateEmbed] });

  Heptagram.pm2.metrics.guilds.set(Heptagram.pm2.metrics.guilds.val() + 1);
  Heptagram.pm2.metrics.events.mark();
};
