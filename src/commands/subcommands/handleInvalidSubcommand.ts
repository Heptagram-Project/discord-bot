import { CommandHandler } from "../../interfaces/commands/CommandHandler";
import { heptagramErrorHandler } from "../../modules/heptagramErrorHandler";

/**
 * This handles a case where a proper subcommand handler isn't found.
 */
export const handleInvalidSubcommand: CommandHandler = async (
  Heptagram,
  interaction
) => {
  try {
    await interaction.reply({
      content: "Command Invalid!",
    });
  } catch (err) {
    await heptagramErrorHandler(
      Heptagram,
      "invalid subcommand",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
  }
};
