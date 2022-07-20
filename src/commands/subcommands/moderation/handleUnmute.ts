import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { updateHistory } from "../../../modules/commands/moderation/updateHistory";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";

/**
 * If the server has configured a muted role, removes it from the `target` for the
 * given `reason`.
 *
 * @param {Heptagram} Heptagram Heptagram's discord instance.
 * @param {Interaction} interaction The interaction object.
 */
export const handleUnmute: CommandHandler = async (Heptagram, interaction) => {
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
      !member.permissions.has("MODERATE_MEMBERS") ||
      (targetMember && targetMember.permissions.has("MODERATE_MEMBERS"))
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
        content: "You can't unmute yourself!",
      });
      return;
    }
    if (target.id === Heptagram.user?.id) {
      await interaction.reply({
        content: "You can't unmute me!",
      });
      return;
    }

    const targetUser = await guild.members.fetch(target.id);

    await updateHistory(Heptagram, "unmute", target.id, guild.id);

    await targetUser.timeout(null, reason);

    await interaction.reply({
      content: "Unmuted " + target.tag + " for " + reason,
    });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "unmute command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Heptagram, "unmute", errorId)],
    });
  }
};
