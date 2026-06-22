export async function getMockPrediction(symbol: string) {
  return {
    symbol,
    sentiment: "neutral",
    confidence: 0.61,
    summary: "V1 占位响应，后续替换为真实 AI 分析结果。",
  };
}

export async function getMockChatReply(message: string) {
  return {
    reply: `已收到消息：${message}。当前为 V1 占位回复。`,
  };
}
