import { createClient } from "@libsql/client/web";

const dbUrl = process.env.NEXT_PUBLIC_TURSO_DATABASE_URL;
const dbAuthToken = process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN;

export const client = createClient({
  url: dbUrl!,
  authToken: dbAuthToken!,
});
