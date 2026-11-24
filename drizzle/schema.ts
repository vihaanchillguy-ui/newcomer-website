import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const siteContent = mysqlTable("siteContent", {
  id: int("id").autoincrement().primaryKey(),
  contentKey: varchar("contentKey", { length: 64 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const galleryItems = mysqlTable("galleryItems", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("imageUrl").notNull(),
  mediaType: mysqlEnum("mediaType", ["image", "video"]).default("image").notNull(),
  published: int("published").default(1).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const newsItems = mysqlTable("newsItems", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  imageUrl: text("imageUrl").notNull(),
  published: int("published").default(0).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description").notNull(),
  price: varchar("price", { length: 32 }).notNull(),
  currency: varchar("currency", { length: 8 }).notNull(),
  platform: varchar("platform", { length: 120 }).notNull(),
  availability: varchar("availability", { length: 120 }).notNull(),
  purchaseUrl: varchar("purchaseUrl", { length: 500 }).notNull().default(""),
  published: int("published").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const supportMessages = mysqlTable("supportMessages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 180 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "in_progress", "closed"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const announcementSubscribers = mysqlTable("announcementSubscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const accountRegistrations = mysqlTable("accountRegistrations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 40 }),
  passwordHash: text("passwordHash"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  sessionTokenHash: varchar("sessionTokenHash", { length: 128 }),
  sessionExpiresAt: timestamp("sessionExpiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const playerProfiles = mysqlTable("playerProfiles", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  handle: varchar("handle", { length: 40 }).notNull().default(""),
  bio: text("bio").notNull().default(""),
  favoriteArea: varchar("favoriteArea", { length: 120 }).notNull().default(""),
  notifications: int("notifications").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const wheelEntries = mysqlTable("wheelEntries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  entryDate: varchar("entryDate", { length: 10 }).notNull(),
  displayName: varchar("displayName", { length: 120 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({
  userDailyEntry: uniqueIndex("wheelEntries_user_date_idx").on(table.userId, table.entryDate),
}));

export const wheelWinners = mysqlTable("wheelWinners", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  winnerDate: varchar("winnerDate", { length: 10 }).notNull().unique(),
  displayName: varchar("displayName", { length: 120 }).notNull(),
  prize: varchar("prize", { length: 160 }).notNull().default("NEWCOMER game key"),
  fulfilled: int("fulfilled").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  fulfilledAt: timestamp("fulfilledAt"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type NewsItem = typeof newsItems.$inferSelect;
export type Product = typeof products.$inferSelect;
export type SupportMessage = typeof supportMessages.$inferSelect;
export type AnnouncementSubscriber = typeof announcementSubscribers.$inferSelect;
export type WheelEntry = typeof wheelEntries.$inferSelect;
export type WheelWinner = typeof wheelWinners.$inferSelect;
export type PlayerProfile = typeof playerProfiles.$inferSelect;
