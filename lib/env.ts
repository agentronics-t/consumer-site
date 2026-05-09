import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  CLERK_SECRET_KEY: z.string().min(1).optional(),
  CLERK_WEBHOOK_SECRET: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  OPENROUTER_API_KEY: z.string().min(1).optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_CHROME_STORE_URL: z
    .string()
    .url()
    .default("https://chromewebstore.google.com/detail/agentronics/PLACEHOLDER"),
});

type ServerEnv = z.infer<typeof serverSchema>;
type ClientEnv = z.infer<typeof clientSchema>;

function parseServer(): ServerEnv {
  const result = serverSchema.safeParse(process.env);
  if (!result.success) {
    console.error("Invalid server environment variables:", result.error.flatten().fieldErrors);
    throw new Error("Invalid server environment variables");
  }
  return result.data;
}

function parseClient(): ClientEnv {
  const result = clientSchema.safeParse({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CHROME_STORE_URL: process.env.NEXT_PUBLIC_CHROME_STORE_URL,
  });
  if (!result.success) {
    console.error("Invalid client environment variables:", result.error.flatten().fieldErrors);
    throw new Error("Invalid client environment variables");
  }
  return result.data;
}

const serverEnv = parseServer();
const clientEnv = parseClient();

export const env = { ...serverEnv, ...clientEnv };

export function requireServerEnv<K extends keyof ServerEnv>(key: K): NonNullable<ServerEnv[K]> {
  const value = serverEnv[key];
  if (value === undefined || value === null || value === "") {
    throw new Error(`Missing required server environment variable: ${String(key)}`);
  }
  return value as NonNullable<ServerEnv[K]>;
}
