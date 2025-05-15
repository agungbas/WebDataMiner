import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define frame state schema
export const frameStates = pgTable("frame_states", {
  id: serial("id").primaryKey(),
  frameId: text("frame_id").notNull().unique(),
  state: text("state").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const insertFrameStateSchema = createInsertSchema(frameStates).omit({
  id: true,
});

// User interactions with frames
export const frameInteractions = pgTable("frame_interactions", {
  id: serial("id").primaryKey(),
  frameId: text("frame_id").notNull(),
  fid: integer("fid").notNull(), // Farcaster user ID
  action: text("action").notNull(), // e.g., "buy_50", "buy_250", "buy_500", "buy_custom"
  amount: integer("amount"), // Token amount to buy
  timestamp: text("timestamp").notNull(),
});

export const insertFrameInteractionSchema = createInsertSchema(frameInteractions).omit({
  id: true,
});

// Types
export type InsertFrameState = z.infer<typeof insertFrameStateSchema>;
export type FrameState = typeof frameStates.$inferSelect;

export type InsertFrameInteraction = z.infer<typeof insertFrameInteractionSchema>;
export type FrameInteraction = typeof frameInteractions.$inferSelect;

// Token data
export const tokenInfo = {
  name: "BISOU",
  symbol: "$BISOU",
  contractAddress: "0x951Ed6e6e75e913494C19173C30C6D3C59CffF8F",
  network: "Base",
  imageUrl: "https://ipfs.io/ipfs/bafkreighrlz43fgcdmqdtyv755zmsqsn5iey5stxvicgxfygfn6mxoy474",
  totalSupply: "1,000,000 $BISOU"
};
