import { EmbedBuilder } from "discord.js";
import moment from "moment";

import { UserFlagMap } from "../../../config/commands/userInfo";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";

/**
 * Generates an embed with information about a user.
 */
export const handleUser: CommandHandler = async (
  Heptagram,
  interaction
): Promise<void> => {
  try {
    const { user, guild } = interaction;

    if (!guild) {
      await interaction.reply({
        content: "This command can only be used in a guild.",
      });
      return;
    }

    const mentioned = interaction.options.getUser("user", true);
    const target = await guild.members.fetch(mentioned?.id || user.id);

    const flagBits = await target.user.fetchFlags();
    const flags = flagBits.toArray();

    const embed = new EmbedBuilder()
      .setColor(Heptagram.colors.default)
      // set thumnail to target user's avatar
      .setThumbnail(target.displayAvatarURL())
      .addField(`Username:`, `${target.user}`, true)
      .addField(`Nickname:`, `${target.displayName}`, true)
      .addField("ID:", `${target.id}`, true)
      .addField("In Server", `${interaction.guild?.name}`, true)
      .addField(
        "Joined The Server On:",
        `${moment(target.joinedTimestamp).format("MMMM Do YYYY, h:mm:ss a")}`,
        true
      )
      .addField(
        "Account Created On:",
        `${moment
          .utc(target.user.createdTimestamp)
          .format("dddd, MMMM Do YYYY")}`,
        true
      )
      .addField(
        "Roles:",
        customSubstring(
          target.roles.cache.map((role) => `<@&${role.id}>`).join(" "),
          1000
        ),
        false
      )
      .addField("Display Color:", target.displayHexColor, true)
      .addField(
        "Nitro:",
        target.premiumSinceTimestamp
          ? `Since ${new Date(
              target.premiumSinceTimestamp
            ).toLocaleDateString()}`
          : "No.",
        true
      )
      .addField(
        "User Badges",
        flags.map((el) => UserFlagMap[el]).join(", ") || "None"
      )
      .setTimestamp()
      .setFooter({
        text: `Message sent by Heptagram || ${Heptagram.version}`,
        iconURL: `${Heptagram.user?.avatarURL()}`,
      });

    await interaction.reply({ embeds: [embed] });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "user command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Heptagram, "user", errorId)],
    });
  }
};
