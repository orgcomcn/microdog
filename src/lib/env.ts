export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "MicroDOG V1",
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id",
  databaseUrl: process.env.DATABASE_URL || "",
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
};
