export const INVITE_BASE_URL = "https://microdoge.ai";

export function buildInviteLink(inviteCode: string | null | undefined) {
  if (!inviteCode) {
    return "";
  }

  return `${INVITE_BASE_URL}/?ref=${inviteCode}`;
}
