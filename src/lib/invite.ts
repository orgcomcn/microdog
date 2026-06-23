export const INVITE_BASE_URL = "http://localhost:3000";

export function buildInviteLink(inviteCode: string | null | undefined) {
  if (!inviteCode) {
    return "";
  }

  return `${INVITE_BASE_URL}/?ref=${inviteCode}`;
}
