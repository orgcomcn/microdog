import { verifyMessage } from "viem";

export async function verifyWalletSignature(payload: {
  address: string;
  message: string;
  signature: string;
}) {
  const verified = await verifyMessage({
    address: payload.address as `0x${string}`,
    message: payload.message,
    signature: payload.signature as `0x${string}`,
  });

  return {
    verified,
    address: payload.address.toLowerCase(),
  };
}
