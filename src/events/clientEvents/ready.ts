import { EmbedBuilder } from "discord.js";

import { Heptagram } from "../../interfaces/Heptagram";
import { heptagramLogHandler } from "../../modules/heptagramLogHandler";

/**
 * Sends a notification to the debug hook when Heptagram has connected to
 * Discord and is ready to receive events.
 *
 * @param {Heptagram} Heptagram's Client instance.
 */
export const ready = async (Heptagram: Heptagram): Promise<void> => {
  heptagramLogHandler.log("info", "Fetching reaction role data...");
  const readyEmbed = new EmbedBuilder();
  readyEmbed.setTitle(
    "<:status_online:951855000605298708> Heptagram is online <:status_online:951855000605298708>"
  );
  readyEmbed.setDescription(
    `${Heptagram.user?.username || "Heptagram"} has come online.`
  );
  readyEmbed.setTimestamp();
  readyEmbed.setColor(Heptagram.colors.success);
  readyEmbed.setFooter({
    text: `Message sent by Heptagram || ${Heptagram.version}`,
    iconURL: `${Heptagram.user?.avatarURL()}`,
  });

  await Heptagram.debugHook.send({ embeds: [readyEmbed] });
  heptagramLogHandler.log("info", "Discord ready!");

  heptagramLogHandler.log("info", "Loaded PM2 counts!");
  Heptagram.pm2.metrics.events.mark();
};
