import { z } from "zod";
import { createWheelEntry, getAdminData, getSiteData, createSupportMessage, deleteGalleryItem, deleteNewsItem, deleteProduct, getAnnouncementSubscribers, getWheelState, markWheelWinnerFulfilled, registerAccount, saveGalleryItem, saveNewsItem, saveProduct, saveSettings, spinDailyWheel, subscribeToAnnouncements } from "./db";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { sendAnnouncementEmail, sendSubscriberWelcome } from "./email";

const mediaSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1).max(160),
  description: z.string().max(500),
  imageUrl: z.string().url(),
  mediaType: z.enum(["image", "video"]),
  published: z.boolean(),
  sortOrder: z.number().int().min(0).max(999),
});

const newsSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1).max(180),
  excerpt: z.string().max(500),
  body: z.string().max(10000),
  imageUrl: z.string().url(),
  published: z.boolean(),
  publishedAt: z.string().nullable().optional(),
});

const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1).max(160),
  description: z.string().max(500),
  price: z.string().max(32),
  currency: z.string().max(8),
  platform: z.string().max(120),
  availability: z.string().max(120),
  purchaseUrl: z.string().url().or(z.literal("")),
  published: z.boolean(),
});

const settingsSchema = z.object({
  overview: z.string().max(2000),
  releaseStatus: z.string().max(500),
  releaseDate: z.string().max(120),
  releaseDescription: z.string().max(2000),
  platforms: z.string().max(240),
  discordUrl: z.string().max(500),
  instagramUrl: z.string().max(500),
  youtubeUrl: z.string().max(500),
  contactEmail: z.string().max(320),
  supportNote: z.string().max(1000),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie("webdev_app_session", { maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  content: router({
    site: publicProcedure.query(() => getSiteData()),
    registerAccount: publicProcedure.input(z.object({ name: z.string().trim().min(2).max(160), email: z.string().trim().email().max(320), phone: z.string().trim().max(40).optional() })).mutation(({ input }) => registerAccount(input).then(() => ({ success: true }))),
    submitSupport: publicProcedure
      .input(z.object({
        name: z.string().min(2).max(120),
        email: z.string().email().max(320),
        subject: z.string().min(2).max(180),
        message: z.string().min(10).max(5000),
      }))
      .mutation(({ input }) => createSupportMessage(input).then(() => ({ success: true }))),
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email().max(320) }))
      .mutation(async ({ input }) => {
        const email = input.email.toLowerCase();
        const created = await subscribeToAnnouncements(email);
        const emailSent = created ? await sendSubscriberWelcome(email) : true;
        return { success: true, emailSent };
      }),
  }),
  wheel: router({
    state: publicProcedure.query(({ ctx }) => getWheelState(ctx.user?.id)),
    enter: protectedProcedure
      .input(z.object({ displayName: z.string().trim().min(2).max(120) }))
      .mutation(({ ctx, input }) => createWheelEntry(ctx.user.id, input.displayName)),
  }),
  admin: router({
    data: adminProcedure.query(() => getAdminData()),
    spinWheel: adminProcedure.mutation(() => spinDailyWheel()),
    markWinnerFulfilled: adminProcedure.input(z.object({ id: z.number(), fulfilled: z.boolean() })).mutation(({ input }) => markWheelWinnerFulfilled(input.id, input.fulfilled).then(() => ({ success: true }))),
    saveSettings: adminProcedure.input(settingsSchema).mutation(({ input }) => saveSettings(input).then(() => ({ success: true }))),
    saveGallery: adminProcedure.input(mediaSchema).mutation(({ input }) => saveGalleryItem(input).then(() => ({ success: true }))),
    deleteGallery: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteGalleryItem(input.id).then(() => ({ success: true }))),
    saveNews: adminProcedure.input(newsSchema).mutation(({ input }) => saveNewsItem(input).then(() => ({ success: true }))),
    deleteNews: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteNewsItem(input.id).then(() => ({ success: true }))),
    saveProduct: adminProcedure.input(productSchema).mutation(({ input }) => saveProduct(input).then(() => ({ success: true }))),
    deleteProduct: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteProduct(input.id).then(() => ({ success: true }))),
    broadcast: adminProcedure
      .input(z.object({ subject: z.string().min(1).max(180), title: z.string().min(1).max(180), body: z.string().min(1).max(5000) }))
      .mutation(async ({ input }) => {
        const subscribers = await getAnnouncementSubscribers();
        let sent = 0;
        for (const subscriber of subscribers) {
          if (await sendAnnouncementEmail({ ...input, email: subscriber.email })) sent += 1;
        }
        return { success: true, sent, total: subscribers.length };
      }),
  }),
});

export type AppRouter = typeof appRouter;
