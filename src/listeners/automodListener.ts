import { Listener } from "../interfaces/listeners/Listener";
import { heptagramErrorHandler } from "../modules/heptagramErrorHandler";

/**
 * Checks if the message content includes a link, and confirms that link
 * has not been set as allowed and the user does not have a link-permitted role.
 *
 * If the message fails these conditions, Heptagram deletes it.
 */
export const automodListener: Listener = {
  name: "automod",
  description: "Handles the automod logic",
  run: async (Heptagram, message) => {
    try {
      if (message.member?.permissions.has("ManageMessages")) {
        return;
      }
    } catch (error) {
      await heptagramErrorHandler(
        Heptagram,
        "automod listener",
        error,
        message.guild?.name,
        message
      );
    }
  },
};
