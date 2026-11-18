import { asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  galleryItems,
  InsertUser,
  newsItems,
  products,
  siteContent,
  supportMessages,
  announcementSubscribers,
  users,
} from "../drizzle/schema";
import {
  DEFAULT_GALLERY,
  DEFAULT_SETTINGS,
  EMPTY_NEWS,
  EMPTY_PRODUCTS,
  MediaItem,
  NewsItem,
  Product,
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
  } else if (user.openId === ENV.ownerOpenId) {
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
  const [settingsRows, gallery, news, productRows, messages, subscribers] = await Promise.all([
    db.select().from(siteContent),
    db.select().from(galleryItems).orderBy(asc(galleryItems.sortOrder)),
    db.select().from(newsItems).orderBy(desc(newsItems.createdAt)),
    db.select().from(products).orderBy(desc(products.createdAt)),
    db.select().from(supportMessages).orderBy(desc(supportMessages.createdAt)),
    getAnnouncementSubscribers(),
  ]);
  const settings = { ...DEFAULT_SETTINGS };
  for (const row of settingsRows) {
    if (row.contentKey in settings) (settings as Record<string, string>)[row.contentKey] = row.value;
  }
  return { settings, gallery, news, products: productRows, messages, subscribers };
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
  await db.insert(announcementSubscribers).values({ email }).onDuplicateKeyUpdate({ set: { email } });
}

export async function getAnnouncementSubscribers() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select().from(announcementSubscribers).orderBy(desc(announcementSubscribers.createdAt));
}
