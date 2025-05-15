import { 
  frameStates, 
  frameInteractions, 
  type FrameState, 
  type FrameInteraction, 
  type InsertFrameState, 
  type InsertFrameInteraction 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Frame state management
  getFrameState(frameId: string): Promise<FrameState | undefined>;
  saveFrameState(frameState: InsertFrameState): Promise<FrameState>;
  updateFrameState(frameId: string, state: string): Promise<FrameState | undefined>;
  
  // Interaction logging
  logFrameInteraction(interaction: InsertFrameInteraction): Promise<FrameInteraction>;
  getFrameInteractions(frameId: string): Promise<FrameInteraction[]>;
}

export class DatabaseStorage implements IStorage {
  async getFrameState(frameId: string): Promise<FrameState | undefined> {
    const results = await db.select().from(frameStates).where(eq(frameStates.frameId, frameId));
    return results.length > 0 ? results[0] : undefined;
  }

  async saveFrameState(insertFrameState: InsertFrameState): Promise<FrameState> {
    const [frameState] = await db.insert(frameStates).values(insertFrameState).returning();
    return frameState;
  }

  async updateFrameState(frameId: string, state: string): Promise<FrameState | undefined> {
    const updatedAt = new Date().toISOString();
    
    const [updatedState] = await db
      .update(frameStates)
      .set({ state, updatedAt })
      .where(eq(frameStates.frameId, frameId))
      .returning();
    
    return updatedState;
  }

  async logFrameInteraction(insertInteraction: InsertFrameInteraction): Promise<FrameInteraction> {
    const [interaction] = await db
      .insert(frameInteractions)
      .values(insertInteraction)
      .returning();
    
    return interaction;
  }

  async getFrameInteractions(frameId: string): Promise<FrameInteraction[]> {
    return db
      .select()
      .from(frameInteractions)
      .where(eq(frameInteractions.frameId, frameId));
  }
}

// For compatibility, providing a MemStorage implementation as fallback
export class MemStorage implements IStorage {
  private frameStates: Map<string, FrameState>;
  private frameInteractions: FrameInteraction[];
  private currentFrameStateId: number;
  private currentInteractionId: number;

  constructor() {
    this.frameStates = new Map();
    this.frameInteractions = [];
    this.currentFrameStateId = 1;
    this.currentInteractionId = 1;
  }

  async getFrameState(frameId: string): Promise<FrameState | undefined> {
    return this.frameStates.get(frameId);
  }

  async saveFrameState(insertFrameState: InsertFrameState): Promise<FrameState> {
    const id = this.currentFrameStateId++;
    const frameState: FrameState = { ...insertFrameState, id };
    this.frameStates.set(frameState.frameId, frameState);
    return frameState;
  }

  async updateFrameState(frameId: string, state: string): Promise<FrameState | undefined> {
    const existingState = this.frameStates.get(frameId);
    if (!existingState) return undefined;

    const updatedState: FrameState = {
      ...existingState,
      state,
      updatedAt: new Date().toISOString()
    };
    
    this.frameStates.set(frameId, updatedState);
    return updatedState;
  }

  async logFrameInteraction(insertInteraction: InsertFrameInteraction): Promise<FrameInteraction> {
    const id = this.currentInteractionId++;
    // Make sure amount is null instead of undefined if not provided
    const amount = insertInteraction.amount === undefined ? null : insertInteraction.amount;
    const interaction: FrameInteraction = { 
      ...insertInteraction, 
      amount,
      id 
    };
    this.frameInteractions.push(interaction);
    return interaction;
  }

  async getFrameInteractions(frameId: string): Promise<FrameInteraction[]> {
    return this.frameInteractions.filter(interaction => interaction.frameId === frameId);
  }
}

// Use the DatabaseStorage implementation
export const storage = new DatabaseStorage();
