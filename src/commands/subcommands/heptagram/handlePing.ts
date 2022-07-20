import { EmbedBuilder } from "discord.js";
import { connection } from "mongoose";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";

/**
 * Generates an embed with Heptagram's response time.
 */
export const handlePing: CommandHandler = async (
  Heptagram,
  interaction
): Promise<void> => {
  try {
    const receivedInteraction = Date.now();

    const botLatency =
      interaction.createdTimestamp - interaction.createdTimestamp;
    const discordAPILatency = Math.round(interaction.client.ws.ping);
    const wsLatency = interaction.client.ws.ping;

    await connection.db.admin().ping();
    const databaseLatency = Date.now() - receivedInteraction;

    const isSlow =
      discordAPILatency > 100 || wsLatency > 100 || databaseLatency > 100;

    const pingEmbed = new EmbedBuilder();
    pingEmbed.setTitle(
      isSlow
        ? "<:status_offline:951855000538206238> Heptagram Pings <:status_offline:951855000538206238>"
        : "<:status_online:951855000605298708> Heptagram Pings <:status_online:951855000605298708>"
    );
    pingEmbed.addFields(
      {
        name: "Heptagram Bot Latency:",
        value: `🏓 Bot latency is \`${botLatency}ms.\``,
        inline: false,
      },
      {
        name: "Discord API Latency:",
        value: `\`${discordAPILatency}ms\``,
        inline: false,
      },
      {
        name: "Discord Websocket Heartbeat:",
        value: `\`${wsLatency}ms.\``,
        inline: false,
      },
      {
        name: "Database Latency:",
        value: `\`${databaseLatency}ms.\``,
        inline: false,
      },
      {
        name: "Heptagram API:",
        value: "Ping coming soon!",
        inline: false,
      }
    );
    pingEmbed.setColor(
      isSlow ? Heptagram.colors.error : Heptagram.colors.success
    );
    pingEmbed.setTimestamp();
    pingEmbed.setFooter({
      text: `Message sent by Heptagram || ${Heptagram.version}`,
      iconURL: `${Heptagram.user?.avatarURL()}`,
    });

    await interaction.reply({ embeds: [pingEmbed] });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "ping command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Heptagram, "ping", errorId)],
    });
  }
};
