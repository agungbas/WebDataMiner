import { 
  frameStates, 
  frameInteractions, 
  type FrameState, 
  type FrameInteraction, 
  type InsertFrameState, 
  type InsertFrameInteraction 
} from "@shared/schema";

export interface IStorage {
  // Frame state management
  getFrameState(frameId: string): Promise<FrameState | undefined>;
  saveFrameState(frameState: InsertFrameState): Promise<FrameState>;
  updateFrameState(frameId: string, state: string): Promise<FrameState | undefined>;
  
  // Interaction logging
  logFrameInteraction(interaction: InsertFrameInteraction): Promise<FrameInteraction>;
  getFrameInteractions(frameId: string): Promise<FrameInteraction[]>;
}

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
    const interaction: FrameInteraction = { ...insertInteraction, id };
    this.frameInteractions.push(interaction);
    return interaction;
  }

  async getFrameInteractions(frameId: string): Promise<FrameInteraction[]> {
    return this.frameInteractions.filter(interaction => interaction.frameId === frameId);
  }
}

export const storage = new MemStorage();
