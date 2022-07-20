import { GuildMember, EmbedBuilder, TextBasedChannel } from "discord.js";

import { Heptagram } from "../../../interfaces/Heptagram";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";

/**
 * Validates if Heptagram has the expected guild-level permissions.
 *
 * @param {Heptagram} Heptagram's Discord instance.
 * @param {GuildMember} HeptagramBot Heptagram's guild member object for that server.
 * @param {TextBasedChannel} channel The channel to send the result to.
 * @returns {boolean} True if Heptagram has ALL required permissions, false otherwise.
 */
export const validateServerPerms = async (
  Heptagram: Heptagram,
  HeptagramBot: GuildMember,
  channel: TextBasedChannel
): Promise<boolean> => {
  try {
    const kickMembers = HeptagramBot.permissions.has("KickMembers");
    const banMembers = HeptagramBot.permissions.has("BanMembers");
    const manageNicknames = HeptagramBot.permissions.has("ManageNicknames");
    const changeNickname = HeptagramBot.permissions.has("ChangeNickname");
    const viewAuditLog = HeptagramBot.permissions.has("ViewAuditLog");
    const manageEvents = HeptagramBot.permissions.has("ManageEvents");
    const moderateMembers = HeptagramBot.permissions.has("ModerateMembers");
    const sendMessages = HeptagramBot.permissions.has("SendMessages");
    const sendMessagesInThreads = HeptagramBot.permissions.has(
      "SendMessagesInThreads"
    );
    const createPublicThreads = HeptagramBot.permissions.has(
      "CreatePublicThreads"
    );
    const createPrivateThreads = HeptagramBot.permissions.has(
      "CreatePrivateThreads"
    );
    const manageMessages = HeptagramBot.permissions.has("ManageMessages");
    const manageThreads = HeptagramBot.permissions.has("ManageThreads");
    const embedLinks = HeptagramBot.permissions.has("EmbedLinks");
    const readMessageHistory =
      HeptagramBot.permissions.has("ReadMessageHistory");
    const addReactions = HeptagramBot.permissions.has("AddReactions");
    const useExternalEmojis = HeptagramBot.permissions.has("UseExternalEmojis");
    const useExternalStickers = HeptagramBot.permissions.has(
      "UseExternalStickers"
    );
    const muteMembers = HeptagramBot.permissions.has("MuteMembers");
    const deafenMembers = HeptagramBot.permissions.has("DeafenMembers");
    const moveMembers = HeptagramBot.permissions.has("MoveMembers");

    const permissionEmbed = new EmbedBuilder();
    permissionEmbed.setTitle("Server Level Permissions");
    permissionEmbed.setDescription(
      "Here are the permissions that I have in this server."
    );
    permissionEmbed.addFields([
      {
        name: "kickMembers",
        value: `${kickMembers}`,
        inline: true,
      },
      {
        name: "changeNickname",
        value: `${changeNickname}`,
        inline: true,
      },
      {
        name: "viewAuditLog",
        value: `${viewAuditLog}`,
        inline: true,
      },
      {
        name: "manageEvents",
        value: `${manageEvents}`,
        inline: true,
      },
      {
        name: "moderateMembers",
        value: `${moderateMembers}`,
        inline: true,
      },
      {
        name: "sendMessages",
        value: `${sendMessages}`,
        inline: true,
      },
      {
        name: "sendMessagesInThreads",
        value: `${sendMessagesInThreads}`,
        inline: true,
      },
      {
        name: "createPublicThreads",
        value: `${createPublicThreads}`,
        inline: true,
      },
      {
        name: "createPrivateThreads",
        value: `${createPrivateThreads}`,
        inline: true,
      },
      {
        name: "manageMessages",
        value: `${manageMessages}`,
        inline: true,
      },
      {
        name: "manageThreads",
        value: `${manageThreads}`,
        inline: true,
      },
      {
        name: "embedLinks",
        value: `${embedLinks}`,
        inline: true,
      },
      {
        name: "readMessageHistory",
        value: `${readMessageHistory}`,
        inline: true,
      },
      {
        name: "addReactions",
        value: `${addReactions}`,
        inline: true,
      },
      {
        name: "useExternalEmojis",
        value: `${useExternalEmojis}`,
        inline: true,
      },
      {
        name: "useExternalStickers",
        value: `${useExternalStickers}`,
        inline: true,
      },
      {
        name: "muteMembers",
        value: `${muteMembers}`,
        inline: true,
      },
      {
        name: "deafenMembers",
        value: `${deafenMembers}`,
        inline: true,
      },
      {
        name: "moveMembers",
        value: `${moveMembers}`,
        inline: true,
      },
    ]);

    await channel.send({ embeds: [permissionEmbed] });

    return (
      kickMembers &&
      banMembers &&
      manageNicknames &&
      changeNickname &&
      viewAuditLog &&
      manageEvents &&
      moderateMembers &&
      sendMessages &&
      sendMessagesInThreads &&
      createPublicThreads &&
      createPrivateThreads &&
      manageMessages &&
      manageThreads &&
      embedLinks &&
      readMessageHistory &&
      addReactions &&
      useExternalEmojis &&
      useExternalStickers &&
      muteMembers &&
      deafenMembers &&
      moveMembers
    );
  } catch (err) {
    await heptagramErrorHandler(Heptagram, "validate server perms module", err);
    return false;
  }
};
