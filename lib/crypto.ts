import { createHash, randomBytes } from "crypto";

export function sha256(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

export function generateApiKey() {
  // ak_live_ + 40 url-safe chars
  const raw = randomBytes(30).toString("base64url");
  const plaintext = `ak_live_${raw}`;
  return { plaintext, hash: sha256(plaintext) };
}

export function generatePairingCode() {
  // 6 digits, zero-padded
  const n = randomBytes(4).readUInt32BE() % 1_000_000;
  return n.toString().padStart(6, "0");
}

export function generateDeviceToken() {
  const raw = randomBytes(32).toString("base64url");
  const plaintext = `dt_${raw}`;
  return { plaintext, hash: sha256(plaintext) };
}
