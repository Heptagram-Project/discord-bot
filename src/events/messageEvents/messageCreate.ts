import { ChannelType, Message } from "discord.js";

import { Heptagram } from "../../interfaces/Heptagram";
import { automodPhish } from "../../listeners/automod/automodPhish";
import { automodListener } from "../../listeners/automodListener";
import { heartsListener } from "../../listeners/heartsListener";
import { runOwnerCommands } from "../../modules/events/runOwnerCommands";
import { heptagramErrorHandler } from "../../modules/heptagramErrorHandler";

/**
 * Handles the onMessage event. Validates that the message did not come from
 * another bot, then passes the message through to the listeners and command handler.
 *
 * @param {Heptagram} Heptagram's Discord instance.
 * @param {Message} message The message object received in the gateway event.
 */
export const messageCreate = async (
  Heptagram: Heptagram,
  message: Message
): Promise<void> => {
  try {
    const { author, channel, guild } = message;

    if (author.bot) {
      return;
    }

    if (!guild || channel.type === ChannelType.DM) {
      return;
    }

    const isScam = await automodPhish(Heptagram, message);

    if (isScam) {
      return;
    }

    await heartsListener.run(Heptagram, message);
    await automodListener.run(Heptagram, message);

    if (
      message.author.id === Heptagram.configs.ownerId &&
      message.content.startsWith("OWN")
    ) {
      await runOwnerCommands(Heptagram, message);
    }

    Heptagram.pm2.metrics.events.mark();
  } catch (err) {
    await heptagramErrorHandler(
      Heptagram,
      "message send event",
      err,
      message.guild?.name,
      message
    );
  }
};
