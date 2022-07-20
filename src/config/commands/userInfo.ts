import { UserFlagsString } from "discord.js";

/**
 * An object to map Discord API values for user badges into
 * human readable strings.
 */
export const UserFlagMap: Record<UserFlagsString, string> = {
  Staff: "Staff",
  Partner: "Partner",
  Hypesquad: "Hypesquad",
  BugHunterLevel1: "Bug Hunter Level 1",
  BugHunterLevel2: "Bug Hunter Level 2",
  HypeSquadOnlineHouse1: "Hypesquad House Bravery",
  HypeSquadOnlineHouse2: "HypeSquad House Brilliance",
  HypeSquadOnlineHouse3: "HypeSquad House Balance",
  PremiumEarlySupporter: "Early Supporter",
  VerifiedBot: "Verified Bot",
  VerifiedDeveloper: "Early Verified Bot Developer",
  CertifiedModerator: "Certified Moderator",
  BotHTTPInteractions: "Bot uses only HTTP interactions",
  Spammer: "User has been identified as spammer",
  Quarantined: "User's account has been quarantined based on recent activity",
  TeamPseudoUser: "User is a team",
};
