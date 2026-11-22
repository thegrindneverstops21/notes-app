import { STORAGE_KEYS } from "../constants";
import {
  isAtOrigin,
  nextFreeSlot,
  spreadStackedNotes,
  type Point,
} from "../lib/canvas";
import { newId } from "../lib/id";
import { readJson, updateJson } from "../lib/storage";
import { validateNoteBody } from "../lib/validation";
import type { Note, NoteChanges, NoteInput } from "../types";
import { listCategories } from "./categoryService";
import { DATA_MESSAGES, DataError } from "./dataError";

export async function listNotes(userId: string): Promise<Note[]> {
  const key = STORAGE_KEYS.notesFor(userId);
  const notes = await readJson<Note[]>(key, []);
  // Two or more cards at 0,0 means they were saved before positions existed.
  if (notes.filter(isAtOrigin).length < 2) return notes;
  return updateJson<Note[]>(key, [], spreadStackedNotes);
}

function cleanTitle(title: string | undefined): string | undefined {
  const value = title?.trim();
  return value ? value : undefined;
}

async function assertCategoryExists(
  userId: string,
  categoryId: string,
): Promise<void> {
  const categories = await listCategories(userId);
  if (!categories.some((category) => category.id === categoryId)) {
    throw new DataError("NOT_FOUND", DATA_MESSAGES.CATEGORY_NOT_FOUND);
  }
}

async function assertValidChanges(
  userId: string,
  changes: NoteChanges,
): Promise<void> {
  if (changes.body !== undefined) {
    const problem = validateNoteBody(changes.body);
    if (problem) throw new DataError("VALIDATION", problem);
  }
  if (changes.categoryId !== undefined) {
    await assertCategoryExists(userId, changes.categoryId);
  }
}

export async function createNote(
  userId: string,
  input: NoteInput,
): Promise<Note> {
  await assertValidChanges(userId, input);
  const id = newId();
  const createdAt = new Date().toISOString();
  const notes = await updateJson<Note[]>(
    STORAGE_KEYS.notesFor(userId),
    [],
    (current) => [
      ...current,
      {
        id,
        categoryId: input.categoryId,
        title: cleanTitle(input.title),
        body: input.body.trim(),
        createdAt,
        ...nextFreeSlot(current),
      },
    ],
  );
  const created = notes.find((note) => note.id === id);
  if (!created) throw new DataError("NOT_FOUND", DATA_MESSAGES.NOTE_NOT_FOUND);
  return created;
}

function applyChanges(note: Note, changes: NoteChanges): Note {
  return {
    ...note,
    categoryId: changes.categoryId ?? note.categoryId,
    title: changes.title === undefined ? note.title : cleanTitle(changes.title),
    body: changes.body === undefined ? note.body : changes.body.trim(),
    updatedAt: new Date().toISOString(),
  };
}

export async function updateNote(
  userId: string,
  noteId: string,
  changes: NoteChanges,
): Promise<Note> {
  await assertValidChanges(userId, changes);
  const notes = await updateJson<Note[]>(
    STORAGE_KEYS.notesFor(userId),
    [],
    (current) =>
      current.map((note) =>
        note.id === noteId ? applyChanges(note, changes) : note,
      ),
  );
  const updated = notes.find((note) => note.id === noteId);
  if (!updated) throw new DataError("NOT_FOUND", DATA_MESSAGES.NOTE_NOT_FOUND);
  return updated;
}

// Moving a card is not an edit, so updatedAt stays untouched.
export async function moveNote(
  userId: string,
  noteId: string,
  position: Point,
): Promise<void> {
  const notes = await updateJson<Note[]>(
    STORAGE_KEYS.notesFor(userId),
    [],
    (current) =>
      current.map((note) =>
        note.id === noteId ? { ...note, x: position.x, y: position.y } : note,
      ),
  );
  if (!notes.some((note) => note.id === noteId)) {
    throw new DataError("NOT_FOUND", DATA_MESSAGES.NOTE_NOT_FOUND);
  }
}

export async function deleteNote(
  userId: string,
  noteId: string,
): Promise<void> {
  await updateJson<Note[]>(STORAGE_KEYS.notesFor(userId), [], (notes) =>
    notes.filter((note) => note.id !== noteId),
  );
}
