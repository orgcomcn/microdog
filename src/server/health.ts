export async function getHealthStatus() {
  return {
    service: "microdog-v1",
    status: "ok",
    timestamp: new Date().toISOString(),
  };
}
