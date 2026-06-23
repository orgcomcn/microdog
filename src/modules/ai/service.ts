import { getPublishedPredictionsForFront } from "@/modules/admin/prediction-service";

export async function getMockPrediction(symbol: string) {
  const predictions = await getPublishedPredictionsForFront();
  const target = predictions.find((item) => item.symbol === symbol.toUpperCase());

  if (!target) {
    return {
      symbol,
      sentiment: "neutral",
      confidence: 0.61,
      summary: "当前没有已发布的人工预测。",
    };
  }

  return {
    id: target.id,
    symbol: target.symbol,
    sentiment: target.direction === "UP" ? "bullish" : "bearish",
    direction: target.direction,
    targetPrice: target.targetPrice,
    publishAt: target.publishAt,
    effectiveUntil: target.effectiveUntil,
    confidence: 0.9,
    summary: target.summary || "后台手动发布的预测内容。",
  };
}

export async function getMockChatReply(message: string) {
  return {
    reply: `已收到消息：${message}。当前为 V1 占位回复。`,
  };
}
