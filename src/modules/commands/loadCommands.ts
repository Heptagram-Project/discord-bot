import { readdir, stat } from "fs/promises";
import { join } from "path";

import { Command } from "../../interfaces/commands/Command";
import { Heptagram } from "../../interfaces/Heptagram";
import { heptagramErrorHandler } from "../../modules/heptagramErrorHandler";

/**
 * Reads the `/commands` directory and dynamically imports the files,
 * then pushes the imported data to an array.
 *
 * @param {Heptagram} Heptagram's Discord instance.
 * @returns {Command[]} Array of Command objects representing the imported commands.
 */
export const loadCommands = async (
  Heptagram: Heptagram
): Promise<Command[]> => {
  try {
    const result: Command[] = [];
    const files = await readdir(
      join(process.cwd(), "src", "commands"),
      "utf-8"
    );
    for (const file of files) {
      const status = await stat(join(process.cwd(), "src", "commands", file));
      if (status.isDirectory()) {
        continue;
      }
      const name = file.split(".")[0];
      const mod = await import(join(process.cwd(), "src", "commands", file));
      result.push(mod[name] as Command);
    }
    return result;
  } catch (err) {
    await heptagramErrorHandler(Heptagram, "slash command loader", err);
    return [];
  }
};
