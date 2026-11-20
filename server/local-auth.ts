import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";
import type { Request, Response } from "express";
import { parse as parseCookieHeader } from "cookie";
import { and, eq, gt } from "drizzle-orm";
import { accountRegistrations } from "../drizzle/schema";
import { getDb } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";

export const LOCAL_SESSION_COOKIE = "newcomer_account_session";
const SESSION_DAYS = 30;

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, expectedHex] = stored.split(":");
  if (!salt || !expectedHex) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}

function hashSession(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function accountAsUser(account: typeof accountRegistrations.$inferSelect) {
  return {
    id: account.id,
    openId: `local_${account.id}`,
    name: account.name,
    email: account.email,
    loginMethod: "password",
    role: account.role,
    createdAt: account.createdAt,
    updatedAt: account.createdAt,
    lastSignedIn: account.createdAt,
  } as const;
}

function sessionExpiry() {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
}

async function setSession(accountId: number, res: Response) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const token = randomBytes(32).toString("hex");
  await db.update(accountRegistrations).set({ sessionTokenHash: hashSession(token), sessionExpiresAt: sessionExpiry() }).where(eq(accountRegistrations.id, accountId));
  res.cookie(LOCAL_SESSION_COOKIE, token, { ...getSessionCookieOptions({} as Request), maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000 });
}

export async function registerLocalAccount(input: { name: string; email: string; phone?: string; password: string }, res: Response, verifiedAdmin = false) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const email = input.email.toLowerCase();
  const [existing] = await db.select().from(accountRegistrations).where(eq(accountRegistrations.email, email)).limit(1);
  const role = existing?.role === "admin" || verifiedAdmin ? "admin" : "user";
  if (existing) {
    await db.update(accountRegistrations).set({ name: input.name, phone: input.phone || null, passwordHash: hashPassword(input.password), role }).where(eq(accountRegistrations.id, existing.id));
    await setSession(existing.id, res);
    return accountAsUser({ ...existing, name: input.name, phone: input.phone || null, passwordHash: "", role });
  }
  const inserted = await db.insert(accountRegistrations).values({ name: input.name, email, phone: input.phone || null, passwordHash: hashPassword(input.password), role });
  const accountId = Number(inserted[0].insertId);
  await setSession(accountId, res);
  const [account] = await db.select().from(accountRegistrations).where(eq(accountRegistrations.id, accountId)).limit(1);
  if (!account) throw new Error("Account could not be created");
  return accountAsUser(account);
}

export async function loginLocalAccount(emailInput: string, password: string, res: Response) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const email = emailInput.toLowerCase();
  const [account] = await db.select().from(accountRegistrations).where(eq(accountRegistrations.email, email)).limit(1);
  if (!account?.passwordHash || !verifyPassword(password, account.passwordHash)) return null;
  await setSession(account.id, res);
  return accountAsUser(account);
}

export async function getLocalAccount(req: Request) {
  const db = await getDb();
  if (!db) return null;
  const token = parseCookieHeader(req.headers.cookie ?? "")[LOCAL_SESSION_COOKIE];
  if (!token) return null;
  const [account] = await db.select().from(accountRegistrations).where(and(eq(accountRegistrations.sessionTokenHash, hashSession(token)), gt(accountRegistrations.sessionExpiresAt, new Date()))).limit(1);
  return account ? accountAsUser(account) : null;
}

export async function logoutLocalAccount(req: Request, res: Response) {
  const db = await getDb();
  const token = parseCookieHeader(req.headers.cookie ?? "")[LOCAL_SESSION_COOKIE];
  if (db && token) await db.update(accountRegistrations).set({ sessionTokenHash: null, sessionExpiresAt: null }).where(eq(accountRegistrations.sessionTokenHash, hashSession(token)));
  res.clearCookie(LOCAL_SESSION_COOKIE, { ...getSessionCookieOptions({} as Request), maxAge: 0 });
}
