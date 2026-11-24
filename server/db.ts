import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  galleryItems,
  InsertUser,
  newsItems,
  products,
  siteContent,
  supportMessages,
  announcementSubscribers,
  accountRegistrations,
  playerProfiles,
  wheelEntries,
  wheelWinners,
  users,
} from "../drizzle/schema";
import {
  DEFAULT_GALLERY,
  DEFAULT_SETTINGS,
  EMPTY_NEWS,
  EMPTY_PRODUCTS,
  MediaItem,
  NewsItem,
  NO_WINNER_ENTRY_COUNT,
  NO_WINNER_LABEL,
  NO_WINNER_PRIZE_LABEL,
  Product,
  RELEASE_DATE_ISO,
  WHEEL_PRIZE_LABEL,
  SiteData,
  SiteSettings,
} from "@shared/content";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  let matchingAdmin = false;
  if (user.email) {
    const existingAdmin = await db.select({ id: users.id }).from(users).where(and(eq(users.email, user.email), eq(users.role, "admin"))).limit(1);
    matchingAdmin = existingAdmin.length > 0;
  }
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId || matchingAdmin) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

function toPublicGallery(rows: typeof galleryItems.$inferSelect[]): MediaItem[] {
  return rows
    .filter(row => row.published === 1)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      imageUrl: row.imageUrl,
      mediaType: row.mediaType,
      published: row.published === 1,
      sortOrder: row.sortOrder,
    }));
}

function toPublicNews(rows: typeof newsItems.$inferSelect[]): NewsItem[] {
  return rows
    .filter(row => row.published === 1)
    .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
    .map(row => ({
      id: row.id,
      title: row.title,
      excerpt: row.excerpt,
      body: row.body,
      imageUrl: row.imageUrl,
      published: row.published === 1,
      publishedAt: row.publishedAt?.toISOString() ?? null,
    }));
}

function toPublicProducts(rows: typeof products.$inferSelect[]): Product[] {
  return rows
    .filter(row => row.published === 1)
    .map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      currency: row.currency,
      platform: row.platform,
      availability: row.availability,
      purchaseUrl: row.purchaseUrl,
      published: row.published === 1,
    }));
}

export async function getSiteData(): Promise<SiteData> {
  const db = await getDb();
  if (!db) {
    return { settings: DEFAULT_SETTINGS, gallery: DEFAULT_GALLERY, news: EMPTY_NEWS, products: EMPTY_PRODUCTS };
  }

  const [settingsRows, galleryRows, newsRows, productRows] = await Promise.all([
    db.select().from(siteContent),
    db.select().from(galleryItems),
    db.select().from(newsItems),
    db.select().from(products),
  ]);

  const settings = { ...DEFAULT_SETTINGS };
  for (const row of settingsRows) {
    if (row.contentKey in settings) {
      (settings as Record<string, string>)[row.contentKey] = row.value;
    }
  }

  return {
    settings,
    gallery: galleryRows.length ? toPublicGallery(galleryRows) : DEFAULT_GALLERY,
    news: toPublicNews(newsRows),
    products: toPublicProducts(productRows),
  };
}

export async function getAdminData() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const [settingsRows, gallery, news, productRows, messages, subscribers, wheel] = await Promise.all([
    db.select().from(siteContent),
    db.select().from(galleryItems).orderBy(asc(galleryItems.sortOrder)),
    db.select().from(newsItems).orderBy(desc(newsItems.createdAt)),
    db.select().from(products).orderBy(desc(products.createdAt)),
    db.select().from(supportMessages).orderBy(desc(supportMessages.createdAt)),
    getAnnouncementSubscribers(),
    getAdminWheelData(),
  ]);
  const settings = { ...DEFAULT_SETTINGS };
  for (const row of settingsRows) {
    if (row.contentKey in settings) (settings as Record<string, string>)[row.contentKey] = row.value;
  }
  return { settings, gallery, news, products: productRows, messages, subscribers, wheel };
}

export async function saveSettings(settings: SiteSettings) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  for (const [contentKey, value] of Object.entries(settings)) {
    await db.insert(siteContent).values({ contentKey, value }).onDuplicateKeyUpdate({ set: { value } });
  }
}

export async function saveGalleryItem(input: MediaItem) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const values = {
    title: input.title,
    description: input.description,
    imageUrl: input.imageUrl,
    mediaType: input.mediaType,
    published: input.published ? 1 : 0,
    sortOrder: input.sortOrder,
  } as const;
  if (input.id) await db.update(galleryItems).set(values).where(eq(galleryItems.id, input.id));
  else await db.insert(galleryItems).values(values);
}

export async function deleteGalleryItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(galleryItems).where(eq(galleryItems.id, id));
}

export async function saveNewsItem(input: NewsItem) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const values = {
    title: input.title,
    excerpt: input.excerpt,
    body: input.body,
    imageUrl: input.imageUrl,
    published: input.published ? 1 : 0,
    publishedAt: input.published ? new Date(input.publishedAt ?? Date.now()) : null,
  } as const;
  if (input.id) await db.update(newsItems).set(values).where(eq(newsItems.id, input.id));
  else await db.insert(newsItems).values(values);
}

export async function deleteNewsItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(newsItems).where(eq(newsItems.id, id));
}

export async function saveProduct(input: Product) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const values = {
    name: input.name,
    description: input.description,
    price: input.price,
    currency: input.currency,
    platform: input.platform,
    availability: input.availability,
    purchaseUrl: input.purchaseUrl ?? "",
    published: input.published ? 1 : 0,
  } as const;
  if (input.id) await db.update(products).set(values).where(eq(products.id, input.id));
  else await db.insert(products).values(values);
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(products).where(eq(products.id, id));
}

export async function createSupportMessage(input: { name: string; email: string; subject: string; message: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(supportMessages).values(input);
}

export async function subscribeToAnnouncements(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await db.select({ id: announcementSubscribers.id }).from(announcementSubscribers).where(eq(announcementSubscribers.email, email)).limit(1);
  if (existing.length) return false;
  await db.insert(announcementSubscribers).values({ email }).onDuplicateKeyUpdate({ set: { email } });
  return true;
}

export async function registerAccount(input: { name: string; email: string; phone?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(accountRegistrations).values({ name: input.name, email: input.email, phone: input.phone || null }).onDuplicateKeyUpdate({ set: { name: input.name, phone: input.phone || null } });
}

export async function getPlayerHubData(userId: number, email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const [profile] = await db.select().from(playerProfiles).where(eq(playerProfiles.email, email.toLowerCase())).limit(1);
  const [entries, wins] = await Promise.all([
    db.select().from(wheelEntries).where(eq(wheelEntries.userId, userId)).orderBy(desc(wheelEntries.createdAt)),
    db.select().from(wheelWinners).where(eq(wheelWinners.userId, userId)).orderBy(desc(wheelWinners.createdAt)),
  ]);
  return { profile: profile ?? null, entries, wins };
}

export async function savePlayerProfile(email: string, input: { handle: string; bio: string; favoriteArea: string; notifications: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const normalizedEmail = email.toLowerCase();
  await db.insert(playerProfiles).values({ email: normalizedEmail, handle: input.handle, bio: input.bio, favoriteArea: input.favoriteArea, notifications: input.notifications ? 1 : 0 }).onDuplicateKeyUpdate({ set: { handle: input.handle, bio: input.bio, favoriteArea: input.favoriteArea, notifications: input.notifications ? 1 : 0 } });
  const [profile] = await db.select().from(playerProfiles).where(eq(playerProfiles.email, normalizedEmail)).limit(1);
  return profile;
}

export async function getAnnouncementSubscribers() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select().from(announcementSubscribers).orderBy(desc(announcementSubscribers.createdAt));
}

function melbourneDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Melbourne" }).format(new Date());
}

async function ensureNoWinnerEntries(db: Awaited<ReturnType<typeof getDb>> extends infer T ? NonNullable<T> : never, today: string) {
  const existing = await db.select({ userId: wheelEntries.userId }).from(wheelEntries).where(and(eq(wheelEntries.entryDate, today), eq(wheelEntries.displayName, NO_WINNER_LABEL)));
  const existingIds = new Set(existing.map(entry => entry.userId));
  const missing = Array.from({ length: NO_WINNER_ENTRY_COUNT }, (_, index) => -(index + 1)).filter(userId => !existingIds.has(userId));
  if (missing.length) await db.insert(wheelEntries).values(missing.map(userId => ({ userId, entryDate: today, displayName: NO_WINNER_LABEL })));
}

export async function getWheelState(userId?: number) {
  const today = melbourneDate();
  const db = await getDb();
  if (!db) return { today, releaseDate: RELEASE_DATE_ISO, isOpen: today <= RELEASE_DATE_ISO, hasEntered: false, entryName: null };
  const entry = userId
    ? await db.select({ displayName: wheelEntries.displayName }).from(wheelEntries).where(and(eq(wheelEntries.userId, userId), eq(wheelEntries.entryDate, today))).limit(1)
    : [];
  return {
    today,
    releaseDate: RELEASE_DATE_ISO,
    isOpen: today <= RELEASE_DATE_ISO,
    hasEntered: entry.length > 0,
    entryName: entry[0]?.displayName ?? null,
  };
}

export async function createWheelEntry(userId: number, displayName: string) {
  const today = melbourneDate();
  if (today > RELEASE_DATE_ISO) throw new Error("The daily wheel has closed.");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await db.select({ id: wheelEntries.id }).from(wheelEntries).where(and(eq(wheelEntries.userId, userId), eq(wheelEntries.entryDate, today))).limit(1);
  if (existing.length) return { created: false, date: today };
  await db.insert(wheelEntries).values({ userId, entryDate: today, displayName });
  return { created: true, date: today };
}

export async function getAdminWheelData() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const today = melbourneDate();
  if (today <= RELEASE_DATE_ISO) await ensureNoWinnerEntries(db, today);
  const [entries, winners] = await Promise.all([
    db.select().from(wheelEntries).orderBy(asc(wheelEntries.createdAt)),
    db.select().from(wheelWinners).orderBy(desc(wheelWinners.createdAt)),
  ]);
  return { today, releaseDate: RELEASE_DATE_ISO, entries, winners };
}

export async function spinDailyWheel() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const today = melbourneDate();
  if (today > RELEASE_DATE_ISO) throw new Error("The daily wheel has closed.");
  await ensureNoWinnerEntries(db, today);
  const existingWinner = await db.select().from(wheelWinners).where(eq(wheelWinners.winnerDate, today)).limit(1);
  if (existingWinner.length) throw new Error("Today’s wheel has already been spun.");
  const entries = await db.select().from(wheelEntries).orderBy(asc(wheelEntries.createdAt));
  if (!entries.length) throw new Error("There are no eligible entries today.");
  const winner = entries[Math.floor(Math.random() * entries.length)];
  const noWinner = winner.displayName === NO_WINNER_LABEL;
  await db.insert(wheelWinners).values({ userId: noWinner ? 0 : winner.userId, winnerDate: today, displayName: winner.displayName, prize: noWinner ? NO_WINNER_PRIZE_LABEL : WHEEL_PRIZE_LABEL, fulfilled: noWinner ? 1 : 0, fulfilledAt: noWinner ? new Date() : null });
  await db.delete(wheelEntries).where(eq(wheelEntries.id, winner.id));
  return { ...winner, winnerDate: today, prize: noWinner ? NO_WINNER_PRIZE_LABEL : WHEEL_PRIZE_LABEL };
}

export async function markWheelWinnerFulfilled(id: number, fulfilled: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(wheelWinners).set({ fulfilled: fulfilled ? 1 : 0, fulfilledAt: fulfilled ? new Date() : null }).where(eq(wheelWinners.id, id));
}
