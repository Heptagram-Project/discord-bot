import { Guild, EmbedBuilder } from "discord.js";

import { Heptagram } from "../../interfaces/Heptagram";

/**
 * Sends a notification to the debug hook when Heptagram leaves a server.
 *
 * @param {Heptagram} Heptagram Heptagram's Discord instance.
 * @param {Guild} guild The guild object representing the server Heptagram was removed from.
 */
export const guildDelete = async (
  Heptagram: Heptagram,
  guild: Guild
): Promise<void> => {
  const owner = await guild.members.fetch(guild.ownerId).catch(() => null);
  const guildDeleteEmbed = new EmbedBuilder();
  guildDeleteEmbed.setTitle(
    `${Heptagram.user?.username || "Heptagram"} has left a guild...`
  );
  guildDeleteEmbed.addFields(
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
  guildDeleteEmbed.setColor(Heptagram.colors.error);
  guildDeleteEmbed.setTimestamp();

  await Heptagram.debugHook.send({ embeds: [guildDeleteEmbed] });

  Heptagram.pm2.metrics.guilds.set(Heptagram.pm2.metrics.guilds.val() - 1);
  Heptagram.pm2.metrics.events.mark();
};
