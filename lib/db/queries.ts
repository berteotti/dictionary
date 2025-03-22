import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { Word, word } from "./schema";
import { desc, eq } from "drizzle-orm";

const client = postgres(process.env.POSTGRES_URL!, { prepare: false });

const db = drizzle(client);

export async function fetchWords(userId: string): Promise<Word[]> {
  try {
    return await db
      .select()
      .from(word)
      .where(eq(word.userId, userId))
      .orderBy(desc(word.updatedAt));
  } catch (error) {
    console.error("Failed to get words from database");
    throw error;
  }
}

export async function fetchWord(id: string): Promise<Word> {
  try {
    const result = await db.select().from(word).where(eq(word.id, id)).limit(1);
    return result[0];
  } catch (error) {
    console.error("Failed to get word from database");
    throw error;
  }
}

export async function createWord(
  userId: string,
  wordName: string,
  definition: string,
  language: string
): Promise<Word> {
  try {
    const result = await db
      .insert(word)
      .values({ userId, word: wordName, definition, language })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Failed to create word in database");
    throw error;
  }
}

export async function editWord(
  id: string,
  wordName: string,
  definition: string
): Promise<void> {
  try {
    const result = await db
      .update(word)
      .set({ word: wordName, definition })
      .where(eq(word.id, id));

    return result[0];
  } catch (error) {
    console.error("Failed to edit word in database");
    throw error;
  }
}

export async function deleteWord(id: string): Promise<void> {
  try {
    await db.delete(word).where(eq(word.id, id));
  } catch (error) {
    console.error("Failed to delete word in database");
    throw error;
  }
}
