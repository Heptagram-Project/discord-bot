import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { updateHistory } from "../../../modules/commands/moderation/updateHistory";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";
import { calculateMilliseconds } from "../../../utils/calculateMilliseconds";

/**
 * If the server has configured a muted role, applies that role to the `target`
 * user for the given `reason`.
 *
 * @param {Heptagram} Heptagram Heptagram's discord instance.
 * @param {Interaction} interaction The interaction object.
 */
export const handleMute: CommandHandler = async (Heptagram, interaction) => {
  try {
    const { guild, member } = interaction;
    const target = interaction.options.getUser("target", true);
    const duration = interaction.options.getInteger("duration", true);
    const durationUnit = interaction.options.getString("unit", true);
    const reason = interaction.options.getString("reason", true);
    const durationMilliseconds = calculateMilliseconds(duration, durationUnit);

    if (!durationMilliseconds) {
      await interaction.reply({
        content: "Invalid duration!",
      });
      return;
    }

    if (durationMilliseconds > 2419200000) {
      await interaction.reply({
        content: "Duration too long!",
      });
      return;
    }

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
        content: "You can't mute yourself!",
      });
      return;
    }
    if (target.id === Heptagram.user?.id) {
      await interaction.reply({
        content: "You can't mute me!",
      });
      return;
    }

    const targetUser = await guild.members.fetch(target.id);

    await updateHistory(Heptagram, "mute", target.id, guild.id);

    await targetUser.timeout(durationMilliseconds, reason);

    await interaction.reply({
      content: "Muted " + target.tag + " for " + reason,
    });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "mute command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Heptagram, "mute", errorId)],
    });
  }
};
