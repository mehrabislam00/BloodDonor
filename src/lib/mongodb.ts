import { MongoClient } from "mongodb";

const mongoUri = process.env.BETTER_AUTH_DB_URL;

if (!mongoUri) {
  throw new Error("BETTER_AUTH_DB_URL is not defined");
}

// ─── Connection singleton ──────────────────────────────────────────────────
// Cache the client on globalThis so that Next.js hot-reload (dev) and
// Vercel's Lambda execution-context reuse (prod) both share a single
// MongoClient rather than creating a new one per module evaluation.
//
// Previously the cache was only written in development, which meant every
// production cold-start created a fresh, uncached client.  When the Lambda
// was reused the old module-scoped reference was gone, leaving any in-flight
// cursors attached to a topology that had already been garbage-collected →
// "MongoTopologyClosedError: Topology is closed".
declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

function createClient(): MongoClient {
  return new MongoClient(mongoUri as string, {
    // Keep the pool small to stay within Atlas free-tier limits and to avoid
    // exhausting connections across concurrent serverless invocations.
    maxPoolSize: 10,
    minPoolSize: 0,
    // Fail fast when Atlas is unreachable instead of hanging a Lambda.
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
    // Match the Vercel function timeout so sockets are not left dangling.
    socketTimeoutMS: 45_000,
  });
}

export const mongoClient: MongoClient =
  globalThis._mongoClient ?? createClient();

// ✅ Always cache — not only in development.
globalThis._mongoClient = mongoClient;

export const database = mongoClient.db("better_auth_db_blood_donor");

// ─── Ensure indexes ────────────────────────────────────────────────────────
// Previously this ran as a fire-and-forget top-level IIFE
// (`void (async () => { ... })()`).  In a serverless environment the Lambda
// may freeze or be killed while that unawaited promise is still resolving a
// cursor, which closes the underlying topology mid-flight and produces the
// "MongoTopologyClosedError: Topology is closed" error seen in the stack
// trace (`at AsyncGenerator.next`).
//
// The function is now exported so it can be awaited explicitly (e.g. from a
// dedicated `/api/init` warm-up route or a one-off migration script).
// If you never call it the indexes can also be created once via the Atlas UI
// or `mongosh`; they are not required at runtime.
export async function ensureIndexes(): Promise<void> {
  try {
    const userCollection = database.collection("user");
    const deletedUsersCollection = database.collection("deletedUsers");
    const deletedDonorsCollection = database.collection("deletedDonors");

    const existingIndexes = await userCollection.indexes();
    const staleUniqueNameIndex = existingIndexes.find(
      (index) => index.unique && index.key && (index.key as Record<string, 1>).name === 1,
    );

    if (staleUniqueNameIndex?.name) {
      await userCollection.dropIndex(staleUniqueNameIndex.name);
    }

    await userCollection.createIndex(
      { email: 1 },
      { unique: true, collation: { locale: "en", strength: 2 } },
    );

    await deletedUsersCollection.createIndex({ deletedAt: -1 });
    await deletedDonorsCollection.createIndex({ deletedAt: -1 });
    await deletedDonorsCollection.createIndex({ userId: 1 });
    await database.collection("notifications").createIndex({ recipientId: 1, createdAt: -1 });
    await database.collection("notifications").createIndex({ reportId: 1, createdAt: -1 });
  } catch {
    // Ignore: indexes already exist, replica-set not yet ready, etc.
  }
}
