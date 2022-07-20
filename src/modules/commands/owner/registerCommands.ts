import { REST } from "@discordjs/rest";
import {
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord-api-types/v9";

import { Heptagram } from "../../../interfaces/Heptagram";
import { heptagramErrorHandler } from "../../heptagramErrorHandler";
import { heptagramLogHandler } from "../../heptagramLogHandler";

/**
 * Takes both the commands and contexts, parses the `data` properties as needed,
 * and builds an array of all command data. Then, posts the data to the Discord endpoint
 * for registering commands.
 *
 * Will register commands globally if in a production environment, otherwise defaults to the
 * home guild only.
 *
 * @param {Heptagram} Heptagram's Discord instance.
 * @returns {boolean} True if the commands were registered, false on error.
 */
export const registerCommands = async (
  Heptagram: Heptagram
): Promise<boolean> => {
  try {
    const rest = new REST({ version: "10" }).setToken(Heptagram.configs.token);

    const commandData: (
      | RESTPostAPIApplicationCommandsJSONBody
      | RESTPostAPIChatInputApplicationCommandsJSONBody
    )[] = [];

    Heptagram.commands.forEach((command) => {
      const data =
        command.data.toJSON() as RESTPostAPIApplicationCommandsJSONBody;
      data.options?.sort((a, b) => a.name.localeCompare(b.name));

      commandData.push(data);
    });

    if (process.env.NODE_ENV === "production") {
      heptagramLogHandler.log("info", "registering commands globally!");

      await rest.put(Routes.applicationCommands(Heptagram.configs.id), {
        body: commandData,
      });
    } else {
      heptagramLogHandler.log("info", "registering to home guild only");
      await rest.put(
        Routes.applicationGuildCommands(
          Heptagram.configs.id,
          Heptagram.configs.testGuildId
        ),
        { body: commandData }
      );
    }
    return true;
  } catch (err) {
    await heptagramErrorHandler(Heptagram, "slash command register", err);
    return false;
  }
};
