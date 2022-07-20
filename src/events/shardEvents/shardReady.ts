import { EmbedBuilder } from "discord.js";

import { Heptagram } from "../../interfaces/Heptagram";
/**
 * Handles the shardReady event - sends a message to the debug hook when
 * a shard comes online.
 *
 * @param {Heptagram} Heptagram's Discord instance.
 * @param {number} shard The number of the shard that has come online.
 */
export const shardReady = async (
  Heptagram: Heptagram,
  shard: number
): Promise<void> => {
  const shardEmbed = new EmbedBuilder();
  shardEmbed.setTitle("Shard Online!");
  shardEmbed.setDescription("Heptagram has brought a new shard online!");
  shardEmbed.addFields({ name: "Shard", value: shard.toString() });
  shardEmbed.setTimestamp();
  shardEmbed.setColor(Heptagram.colors.success);

  await Heptagram.debugHook.send({ embeds: [shardEmbed] });
  Heptagram.pm2.metrics.events.mark();
};
