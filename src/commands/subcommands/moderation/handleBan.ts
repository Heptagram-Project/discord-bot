import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { updateHistory } from "../../../modules/commands/moderation/updateHistory";
import { errorEmbedGenerator } from "../../../modules/errorEmbedGenerator";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";

/**
 * Bans the `target` user for the provided `reason`, assuming the caller has permissions.
 * Also deletes the `target`'s messages from the last 24 hours.
 *
 * @param {Heptagram} Heptagram Heptagram's discord instance.
 * @param {Interaction} interaction The interaction object.
 */
export const handleBan: CommandHandler = async (Heptagram, interaction) => {
  try {
    const { guild, member } = interaction;
    const target = interaction.options.getUser("target", true);
    const prune = interaction.options.getNumber("prune", true);
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
      !member.permissions.has("BAN_MEMBERS") ||
      (targetMember && targetMember.permissions.has("BAN_MEMBERS"))
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
        content: "You can't ban yourself!",
      });
      return;
    }
    if (target.id === Heptagram.user?.id) {
      await interaction.reply({
        content: "You can't ban me!",
      });
      return;
    }

    if (prune < 0 || prune > 7) {
      await interaction.reply({
        content: "Invalid prune value!",
      });
      return;
    }

    if (!targetMember.bannable) {
      await interaction.reply({
        content: "I can't ban that user!",
      });
      return;
    }

    await updateHistory(Heptagram, "ban", target.id, guild.id);

    await targetMember.ban({
      reason: customSubstring(reason, 1000),
      days: prune,
    });

    await interaction.reply({
      content: `Banned ${target.tag}`,
    });
  } catch (err) {
    const errorId = await heptagramErrorHandler(
      Heptagram,
      "ban command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Heptagram, "ban", errorId)],
    });
  }
};
