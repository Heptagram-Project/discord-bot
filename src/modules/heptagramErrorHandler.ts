import {
  CommandInteraction,
  Message,
  EmbedBuilder,
  version as libraryVersion,
} from "discord.js";
import { Types } from "mongoose";
import { version as tsVersion } from "typescript";

import { Heptagram } from "../interfaces/Heptagram";
import { customSubstring } from "../utils/customSubstring";

import { heptagramLogHandler } from "./heptagramLogHandler";

/**
 * Takes the error object generated within the code, logs the
 * information in the console. Then, generates an error ID, builds an error embed, and sends
 * that to the debug hook. Finally, returns the error ID to be passed to the user if applicable.
 *
 * @param {Heptagram} Heptagram's Discord instance.
 * @param {string} context The string explaining where this error was thrown.
 * @param {unknown} err The standard error object (generated in a catch statement).
 * @param {string | undefined} guild The name of the guild that triggered the issue.
 * @param {Message | undefined} message Optional message that triggered the issue.
 * @param { CommandInteraction | undefined } interaction Optional interaction that triggered the issue.
 * @returns {Types.ObjectId} A unique ID for the error.
 */
export const heptagramErrorHandler = async (
  Heptagram: Heptagram,
  context: string,
  err: unknown,
  guild?: string,
  message?: Message,
  interaction?: CommandInteraction
): Promise<Types.ObjectId> => {
  if (Heptagram.pm2.metrics.errors) {
    Heptagram.pm2.metrics.errors.mark();
  }
  const error = err as Error;
  heptagramLogHandler.log("error", `There was an error in the ${context}:`);
  heptagramLogHandler.log(
    "error",
    JSON.stringify({ errorMessage: error.message, errorStack: error.stack })
  );

  const errorId = new Types.ObjectId();
  const errorEmbed = new EmbedBuilder();
  errorEmbed.setTitle(
    `${context} error ${guild ? "in " + guild : "from an unknown source"}.`
  );
  errorEmbed.setColor(Heptagram.colors.error);
  errorEmbed.setDescription(customSubstring(error.message, 2000));
  errorEmbed.addFields(
    {
      name: "Stack Trace:",
      value: `\`\`\`\n${customSubstring(error.stack || "null", 1000)}\n\`\`\``,
    },
    {
      name: "Error ID:",
      value: errorId.toHexString(),
    }
  );

  errorEmbed.addFields(
    { name: "Debug information:", value: "\u200B" },
    { name: "Bot Version", value: Heptagram.version, inline: true },
    { name: "TypeScript Version", value: `v${tsVersion}`, inline: true },
    { name: "discord.js Version", value: `v${libraryVersion}`, inline: true }
  ),
    errorEmbed.setTimestamp();
  if (message) {
    errorEmbed.addFields({
      name: "Message Content:",
      value: customSubstring(message.content, 1000),
    });
  }

  if (interaction) {
    errorEmbed.addFields(
      {
        name: "Interaction Options",
        value: customSubstring(
          interaction.options.data[0].options
            ?.map((o) => `\`${o.name}\`: ${o.value}`)
            .join(", ") || "no options",
          1000
        ),
      },
      {
        name: "Interaction Details",
        value: customSubstring(
          `${interaction.commandName} ${
            interaction.isChatInputCommand()
              ? interaction.isChatInputCommand() || ""
              : ""
          }`,
          1000
        ),
      }
    );
  }
  await Heptagram.debugHook.send({ embeds: [errorEmbed] });

  return errorId;
};
