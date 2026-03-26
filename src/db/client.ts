import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

import { join, resolve, isAbsolute } from "path";

const rawDbPath =
  process.env.DATABASE_URL?.replace("file:", "") || "data/local.db";
const dbPath = isAbsolute(rawDbPath)
  ? rawDbPath
  : resolve(process.cwd(), rawDbPath);

console.log("[db] opening sqlite dbPath=", dbPath);

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
