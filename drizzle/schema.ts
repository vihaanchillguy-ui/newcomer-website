import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type NewsItem = typeof newsItems.$inferSelect;
export type Product = typeof products.$inferSelect;
export type SupportMessage = typeof supportMessages.$inferSelect;
