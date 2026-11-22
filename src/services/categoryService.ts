import { DEFAULT_CATEGORY_NAMES, STORAGE_KEYS } from "../constants";
import { newId } from "../lib/id";
import { readJson, updateJson } from "../lib/storage";
import { validateCategoryName } from "../lib/validation";
import type { Category, Note } from "../types";
import { DATA_MESSAGES, DataError } from "./dataError";

const sameName = (a: string, b: string): boolean =>
  a.trim().toLowerCase() === b.trim().toLowerCase();

function buildDefaultCategories(): Category[] {
  const createdAt = new Date().toISOString();
  return DEFAULT_CATEGORY_NAMES.map((name) => ({
    id: newId(),
    name,
    createdAt,
  }));
}

// First read for an account seeds Work, Study and Personal. Once the key exists
// (even as an empty list after the user deletes everything) it is never seeded again.
export async function listCategories(userId: string): Promise<Category[]> {
  const key = STORAGE_KEYS.categoriesFor(userId);
  const stored = await readJson<Category[] | null>(key, null);
  if (stored !== null) return stored;

  const seeded = await updateJson<Category[] | null>(
    key,
    null,
    (current) => current ?? buildDefaultCategories(),
  );
  return seeded ?? [];
}

function cleanName(name: string): string {
  const problem = validateCategoryName(name);
  if (problem) throw new DataError("VALIDATION", problem);
  return name.trim();
}

function assertNameFree(
  categories: Category[],
  name: string,
  ignoreId?: string,
): void {
  const clash = categories.some(
    (category) => category.id !== ignoreId && sameName(category.name, name),
  );
  if (clash)
    throw new DataError("CATEGORY_EXISTS", DATA_MESSAGES.CATEGORY_EXISTS);
}

export async function createCategory(
  userId: string,
  name: string,
): Promise<Category> {
  const clean = cleanName(name);
  const category: Category = {
    id: newId(),
    name: clean,
    createdAt: new Date().toISOString(),
  };
  await updateJson<Category[]>(
    STORAGE_KEYS.categoriesFor(userId),
    [],
    (categories) => {
      assertNameFree(categories, clean);
      return [...categories, category];
    },
  );
  return category;
}

export async function renameCategory(
  userId: string,
  categoryId: string,
  name: string,
): Promise<Category> {
  const clean = cleanName(name);
  const categories = await updateJson<Category[]>(
    STORAGE_KEYS.categoriesFor(userId),
    [],
    (current) => {
      assertNameFree(current, clean, categoryId);
      return current.map((category) =>
        category.id === categoryId ? { ...category, name: clean } : category,
      );
    },
  );
  const renamed = categories.find((category) => category.id === categoryId);
  if (!renamed)
    throw new DataError("NOT_FOUND", DATA_MESSAGES.CATEGORY_NOT_FOUND);
  return renamed;
}

// Notes go first. If the second step fails you keep an empty category, never hidden orphan notes.
export async function deleteCategory(
  userId: string,
  categoryId: string,
): Promise<void> {
  await updateJson<Note[]>(STORAGE_KEYS.notesFor(userId), [], (notes) =>
    notes.filter((note) => note.categoryId !== categoryId),
  );
  await updateJson<Category[]>(
    STORAGE_KEYS.categoriesFor(userId),
    [],
    (categories) => categories.filter((category) => category.id !== categoryId),
  );
}
