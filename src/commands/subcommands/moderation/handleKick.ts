import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { updateHistory } from "../../../modules/commands/moderation/updateHistory";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";

/**
 * Provided the caller has permission, kicks the `target` user from the guild
 * for the given `reason`.
 *
 * @param {Heptagram} Heptagram Heptagram's discord instance.
 * @param {Interaction} interaction The interaction object.
 */
export const handleKick: CommandHandler = async (Heptagram, interaction) => {
  try {
    const { guild, member } = interaction;
    const target = interaction.options.getUser("target", true);
    const reason = interaction.options.getString("reason", true);

    if (!guild) {
      await interaction.reply({
        content: "Missing Guild!!",
      });
      return;
    }

    const targetMember = await guild.members.fetch(target.id).catch(() => null);

    if (
      !member ||
      typeof member.permissions === "string" ||
      !member.permissions.has("KICK_MEMBERS") ||
      (targetMember && targetMember.permissions.has("KICK_MEMBERS"))
    ) {
      await interaction.reply({
        content: "You don't have permission to do that!",
      });
      return;
    }

    if (!targetMember) {
      await interaction.reply({
        content: "That user appears to have left the guild.",
      });
      return;
    }

    if (target.id === member.user.id) {
      await interaction.reply({
        content: "You can't kick yourself!",
      });
      return;
    }
    if (target.id === Heptagram.user?.id) {
      await interaction.reply({
        content: "You can't kick me!",
      });
      return;
    }

    if (!targetMember.kickable) {
      await interaction.reply({
        content: "I can't kick this user!",
      });
      return;
    }

    await updateHistory(Heptagram, "kick", target.id, guild.id);

    await targetMember.kick(customSubstring(reason, 1000));

    await interaction.reply({ content: "Kicked " + target.tag });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "kick command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Heptagram, "kick", errorId)],
    });
  }
};
