import { STORAGE_KEYS } from "../constants";
import { newId } from "../lib/id";
import { readJson, updateJson } from "../lib/storage";
import { validateNoteBody } from "../lib/validation";
import type { Note, NoteChanges, NoteInput } from "../types";
import { listCategories } from "./categoryService";
import { DATA_MESSAGES, DataError } from "./dataError";

export function listNotes(userId: string): Promise<Note[]> {
  return readJson<Note[]>(STORAGE_KEYS.notesFor(userId), []);
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
  const note: Note = {
    id: newId(),
    categoryId: input.categoryId,
    title: cleanTitle(input.title),
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
    x: 0,
    y: 0,
  };
  await updateJson<Note[]>(STORAGE_KEYS.notesFor(userId), [], (notes) => [
    ...notes,
    note,
  ]);
  return note;
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

export async function deleteNote(
  userId: string,
  noteId: string,
): Promise<void> {
  await updateJson<Note[]>(STORAGE_KEYS.notesFor(userId), [], (notes) =>
    notes.filter((note) => note.id !== noteId),
  );
}
