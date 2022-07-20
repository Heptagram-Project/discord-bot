import { EmbedBuilder, Message, Guild } from "discord.js";

import { Heptagram } from "../../../interfaces/Heptagram";
import { heptagramErrorHandler } from "../../heptagramErrorHandler";

/**
 * Owner command for flagging new scam domains.
 *
 * @param {Heptagram} Heptagram's discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const servers = async (Heptagram: Heptagram, message: Message) => {
  try {
    // get args
    const [, , serverId] = message.content.split(" ");

    if (!serverId) {
      Heptagram.guilds.cache.forEach(async (guild) => {
        await message.channel.send({
          content: `Guild ${guild.name} (\`${guild.id}\`) owned by <@${guild.ownerId}>`,
        });
      });
      return;
    }

    Heptagram.guilds.fetch(serverId).then((guild: Guild) => {
      if (!guild) {
        console.error(`Guild ${serverId} not found.`);
        return null;
      }

      guild.fetchOwner().then(async (GuildMember) => {
        const embed = new EmbedBuilder()
          .setColor(Heptagram.colors.default)
          .setTitle(`Server info for the ${guild.name} server:`)
          .setDescription("Server Information for the specified guild.")
          .addFields(
            { name: "Guild Name", value: `${guild.name}`, inline: true },
            { name: "Guild ID", value: `\`${guild.id}\``, inline: true },
            {
              name: "Guild Member Count",
              value: `${guild.memberCount}`,
              inline: true,
            },
            { name: "Guild Owner", value: `${GuildMember}`, inline: true }
          )
          .setTimestamp()
          .setFooter({
            text: `Message sent by Heptagram || ${Heptagram.version}`,
            iconURL: `${Heptagram.user?.avatarURL()}`,
          });

        await message.reply({ embeds: [embed] });
      });
    });
  } catch (err) {
    await heptagramErrorHandler(
      Heptagram,
      "OWN servers",
      err,
      message.guild?.name,
      message
    );
  }
};
