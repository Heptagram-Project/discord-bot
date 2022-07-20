import { GuildMember, EmbedBuilder, TextBasedChannel } from "discord.js";

import { Heptagram } from "../../../interfaces/Heptagram";
import { heptagramErrorHandler } from "../../../modules/heptagramErrorHandler";

/**
 * Validates that Heptagram has the expected channel-level permissions.
 *
 * @param {Heptagram} Heptagram's Discord instance.
 * @param {GuildMember} HeptagramBot Heptagram's guild member object for that server.
 * @param {TextBasedChannel} channel The channel to check permissions on.
 * @returns {boolean} True if Heptagram has ALL required permissions, false otherwise.
 */
export const validateChannelPerms = async (
  Heptagram: Heptagram,
  HeptagramBot: GuildMember,
  channel: TextBasedChannel
): Promise<boolean> => {
  try {
    const kickMembers = HeptagramBot.permissionsIn(channel.id).has(
      "KickMembers"
    );
    const banMembers = HeptagramBot.permissionsIn(channel.id).has("BanMembers");
    const manageNicknames = HeptagramBot.permissionsIn(channel.id).has(
      "ManageNicknames"
    );

    const changeNickname = HeptagramBot.permissionsIn(channel.id).has(
      "ChangeNickname"
    );

    const viewAuditLog = HeptagramBot.permissionsIn(channel.id).has(
      "ViewAuditLog"
    );

    const manageEvents = HeptagramBot.permissionsIn(channel.id).has(
      "ManageEvents"
    );

    const moderateMembers = HeptagramBot.permissionsIn(channel.id).has(
      "ModerateMembers"
    );

    const sendMessages = HeptagramBot.permissionsIn(channel.id).has(
      "SendMessages"
    );

    const sendMessagesInThreads = HeptagramBot.permissionsIn(channel.id).has(
      "SendMessagesInThreads"
    );

    const createPublicThreads = HeptagramBot.permissionsIn(channel.id).has(
      "CreatePublicThreads"
    );

    const createPrivateThreads = HeptagramBot.permissionsIn(channel.id).has(
      "CreatePrivateThreads"
    );

    const manageMessages = HeptagramBot.permissionsIn(channel.id).has(
      "ManageMessages"
    );

    const manageThreads = HeptagramBot.permissionsIn(channel.id).has(
      "ManageThreads"
    );

    const embedLinks = HeptagramBot.permissionsIn(channel.id).has("EmbedLinks");

    const readMessageHistory = HeptagramBot.permissionsIn(channel.id).has(
      "ReadMessageHistory"
    );

    const addReactions = HeptagramBot.permissionsIn(channel.id).has(
      "AddReactions"
    );

    const useExternalEmojis = HeptagramBot.permissionsIn(channel.id).has(
      "UseExternalEmojis"
    );

    const useExternalStickers = HeptagramBot.permissionsIn(channel.id).has(
      "UseExternalStickers"
    );

    const muteMembers = HeptagramBot.permissionsIn(channel.id).has(
      "MuteMembers"
    );

    const deafenMembers = HeptagramBot.permissionsIn(channel.id).has(
      "DeafenMembers"
    );

    const moveMembers = HeptagramBot.permissionsIn(channel.id).has(
      "MoveMembers"
    );

    const permissionEmbed = new EmbedBuilder();
    permissionEmbed.setTitle("Chennel Level Permissions");
    permissionEmbed.setDescription(
      "Here are the permissions that I have in this channel."
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
    permissionEmbed.setColor(Heptagram.colors.default);
    permissionEmbed.setTimestamp();
    permissionEmbed.setFooter({
      text: `ID: ${channel.id}`,
    });

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
    await heptagramErrorHandler(
      Heptagram,
      "validate channel perms module",
      err
    );
    return false;
  }
};
