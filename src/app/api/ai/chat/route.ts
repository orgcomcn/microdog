import { ok, fail } from "@/lib/api";
import { getMockChatReply } from "@/modules/ai/service";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    message?: string;
  };

  if (!body.message) {
    return fail("Message is required.");
  }

  return ok(await getMockChatReply(body.message));
}
