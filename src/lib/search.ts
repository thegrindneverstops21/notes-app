import type { Note, SortOrder } from "../types";
import { plainText } from "./blocks";

const WHITESPACE = /\s+/;

// Matches a note when ANY typed word appears in its title or body (case-insensitive).
export function searchNotes(notes: Note[], query: string): Note[] {
  const words = query.toLowerCase().split(WHITESPACE).filter(Boolean);
  if (words.length === 0) return notes;

  return notes.filter((note) => {
    const text = `${note.title ?? ""} ${plainText(note.body)}`.toLowerCase();
    return words.some((word) => text.includes(word));
  });
}

export function sortNotes(notes: Note[], order: SortOrder): Note[] {
  const direction = order === "asc" ? 1 : -1;
  return [...notes].sort(
    (a, b) => direction * a.createdAt.localeCompare(b.createdAt),
  );
}
