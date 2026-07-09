import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, teamMembers, InsertTeamMember, TeamMember, designHistory, InsertDesignHistory, DesignHistory } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ─── Team Members ────────────────────────────────────────────────────────
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get team members: database not available");
    return [];
  }

  try {
    const result = await db.select().from(teamMembers).where(eq(teamMembers.isActive, true));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get team members:", error);
    return [];
  }
}

export async function createTeamMember(member: InsertTeamMember): Promise<TeamMember | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create team member: database not available");
    return null;
  }

  try {
    await db.insert(teamMembers).values(member);
    const result = await db.select().from(teamMembers).where(eq(teamMembers.id, member.id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create team member:", error);
    throw error;
  }
}

export async function updateTeamMember(id: string, updates: Partial<InsertTeamMember>): Promise<TeamMember | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update team member: database not available");
    return null;
  }

  try {
    await db.update(teamMembers).set(updates).where(eq(teamMembers.id, id));
    const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update team member:", error);
    throw error;
  }
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete team member: database not available");
    return false;
  }

  try {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete team member:", error);
    return false;
  }
}

// ─── Design History & Favorites ────────────────────────────────────────────────
export async function saveDesignToHistory(userId: number, design: Omit<InsertDesignHistory, 'id' | 'userId'>): Promise<DesignHistory | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save design: database not available");
    return null;
  }

  try {
    const id = `design-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const designWithId = { ...design, id, userId } as InsertDesignHistory;
    await db.insert(designHistory).values(designWithId);
    const result = await db.select().from(designHistory).where(eq(designHistory.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to save design:", error);
    throw error;
  }
}

export async function getUserDesignHistory(userId: number, limit: number = 50): Promise<DesignHistory[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get design history: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(designHistory)
      .where(eq(designHistory.userId, userId))
      .orderBy(desc(designHistory.createdAt))
      .limit(limit);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get design history:", error);
    return [];
  }
}

export async function getUserFavoriteDesigns(userId: number): Promise<DesignHistory[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get favorite designs: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(designHistory)
      .where(eq(designHistory.userId, userId) && eq(designHistory.isFavorite, true))
      .orderBy(desc(designHistory.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get favorite designs:", error);
    return [];
  }
}

export async function toggleDesignFavorite(designId: string, isFavorite: boolean): Promise<DesignHistory | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot toggle favorite: database not available");
    return null;
  }

  try {
    await db.update(designHistory).set({ isFavorite }).where(eq(designHistory.id, designId));
    const result = await db.select().from(designHistory).where(eq(designHistory.id, designId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to toggle favorite:", error);
    throw error;
  }
}

export async function updateDesignName(designId: string, designName?: string, notes?: string): Promise<DesignHistory | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update design: database not available");
    return null;
  }

  try {
    const updates: Partial<InsertDesignHistory> = {};
    if (designName !== undefined) updates.designName = designName;
    if (notes !== undefined) updates.notes = notes;
    await db.update(designHistory).set(updates).where(eq(designHistory.id, designId));
    const result = await db.select().from(designHistory).where(eq(designHistory.id, designId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update design:", error);
    throw error;
  }
}

export async function deleteDesign(designId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete design: database not available");
    return false;
  }

  try {
    await db.delete(designHistory).where(eq(designHistory.id, designId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete design:", error);
    return false;
  }
}

export async function getTeamMemberByPin(pin: string): Promise<TeamMember | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get team member: database not available");
    return null;
  }

  try {
    const result = await db.select().from(teamMembers).where(eq(teamMembers.pin, pin)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get team member by PIN:", error);
    return null;
  }
}
