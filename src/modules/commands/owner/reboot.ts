import { Message, EmbedBuilder } from "discord.js";
import moment from "moment";

import { Heptagram } from "../../../interfaces/Heptagram";
import { heptagramErrorHandler } from "../../heptagramErrorHandler";
import { heptagramLogHandler } from "../../heptagramLogHandler";

/**s
 * Reloads and restarts the bot.
 * @param {Heptagram} Heptagram's Discord instance.
 * @returns {boolean} True if the commands were registered, false on error.
 */
export const reboot = async (Heptagram: Heptagram, message: Message) => {
  // set time to current time in unix
  const time = moment().unix();

  const embed = new EmbedBuilder()
    .setColor(Heptagram.colors.error)
    .setTitle(
      `<:status_offline:951855000538206238> **Bot Restarting...** <:status_offline:951855000538206238>`
    )
    .setDescription(
      `The bot has been qued to restart by ${message.author.username} on <t:${time}>.`
    )
    .setTimestamp()
    .setFooter({
      text: `Message sent by Heptagram || ${Heptagram.version}`,
      iconURL: `${Heptagram.user?.avatarURL()}`,
    });

  try {
    message.reply(
      "The bot will now reboot or shutdown.\n" +
        "Please confirm by responding with `yes`, or deny with `no`."
    );

    message.channel
      .awaitMessages({
        filter: (m) => m.author.id === message.author.id,
        max: 1,
        time: 30000,
      })
      .then(async (collected) => {
        if (collected.first()?.content.toLowerCase() === "yes") {
          heptagramLogHandler.log(
            `info`,
            `${message.author.username} has rebooted the bot.`
          );
          (await Heptagram.debugHook.send({ embeds: [embed] })) &&
            message.reply({ embeds: [embed] }).then(() => {
              process.exit();
            });
        }

        if (collected.first()?.content.toLowerCase() === "no") {
          message.reply("The bot will not reboot.");
        }
      })
      .catch(() => {
        message.reply("No answer after 30 seconds, operation canceled.");
      });
  } catch (err) {
    await heptagramErrorHandler(
      Heptagram,
      "OWN reboot",
      err,
      message.guild?.name,
      message
    );
  }
};
