import { CANVAS } from "../constants";
import type { Note } from "../types";

export type Point = { x: number; y: number };

export function slotPosition(index: number): Point {
  return {
    x: (index % CANVAS.SLOT_COLUMNS) * (CANVAS.CARD_WIDTH + CANVAS.SLOT_GAP),
    y:
      Math.floor(index / CANVAS.SLOT_COLUMNS) *
      (CANVAS.SLOT_ROW_HEIGHT + CANVAS.SLOT_GAP),
  };
}

export const isAtOrigin = (note: Note): boolean => note.x === 0 && note.y === 0;

export function nextFreeSlot(notes: Note[]): Point {
  for (let index = 0; ; index += 1) {
    const slot = slotPosition(index);
    if (!notes.some((note) => note.x === slot.x && note.y === slot.y)) {
      return slot;
    }
  }
}

// Notes saved before positions existed all sit at 0,0. Fan them out in their current order.
export function spreadStackedNotes(notes: Note[]): Note[] {
  const taken = notes.filter((note) => !isAtOrigin(note));
  return notes.map((note) => {
    if (!isAtOrigin(note)) return note;
    const placed = { ...note, ...nextFreeSlot(taken) };
    taken.push(placed);
    return placed;
  });
}
