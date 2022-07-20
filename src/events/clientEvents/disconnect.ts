import { EmbedBuilder } from "discord.js";

import { Heptagram } from "../../interfaces/Heptagram";
/**
 * Sends a message to the debug hook when Heptagram disconnects.
 *
 * @param {Heptagram} Heptagram's Discord instance.
 */
export const disconnect = async (Heptagram: Heptagram): Promise<void> => {
  const disconnectEmbed = new EmbedBuilder();
  disconnectEmbed.setTitle("Heptagram has disconnected");
  disconnectEmbed.setDescription(
    `${
      Heptagram.user?.username || "Heptagram"
    } is no longer connected to Discord.`
  );
  disconnectEmbed.setTimestamp();
  disconnectEmbed.setColor(Heptagram.colors.error);
  await Heptagram.debugHook.send({ embeds: [disconnectEmbed] });
  Heptagram.pm2.metrics.events.mark();
};
