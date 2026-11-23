import { CANVAS, ZOOM } from "../constants";
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

export type Size = { width: number; height: number };
export type CameraState = { x: number; y: number; scale: number };

// Origin of the zoom, sent to the editor page as route params (strings).
export type OriginParams = { ox: string; oy: string; ow: string };

// Where a card sits on the phone screen. The canvas scales around the screen centre, then shifts.
export function cardOrigin(
  note: Point,
  camera: CameraState,
  screen: Size,
): OriginParams {
  const cx = screen.width / 2;
  const cy = screen.height / 2;
  const px = note.x + CANVAS.CARD_WIDTH / 2;
  const py = note.y + CANVAS.SLOT_ROW_HEIGHT / 2;
  return {
    ox: String(Math.round(camera.x + cx + camera.scale * (px - cx))),
    oy: String(Math.round(camera.y + cy + camera.scale * (py - cy))),
    ow: String(Math.round(CANVAS.CARD_WIDTH * camera.scale)),
  };
}

// A new card grows out of the bottom bar.
export function newCardOrigin(screen: Size): OriginParams {
  return {
    ox: String(Math.round(screen.width / 2)),
    oy: String(Math.round(screen.height - ZOOM.NEW_CARD_BOTTOM)),
    ow: String(ZOOM.NEW_CARD_WIDTH),
  };
}

export type ZoomStart = { dx: number; dy: number; scale: number };

// Turns the route params into where the page starts. Missing or bad values fall back to a gentle zoom from the centre.
export function parseOrigin(
  params: { ox?: string; oy?: string; ow?: string },
  screen: Size,
): ZoomStart {
  const ox = Number(params.ox);
  const oy = Number(params.oy);
  const ow = Number(params.ow);
  if (![ox, oy, ow].every(Number.isFinite) || params.ox === undefined) {
    return { dx: 0, dy: 0, scale: ZOOM.DEFAULT_SCALE };
  }
  const scale = Math.min(
    ZOOM.MAX_SCALE,
    Math.max(ZOOM.MIN_SCALE, ow / screen.width),
  );
  return { dx: ox - screen.width / 2, dy: oy - screen.height / 2, scale };
}
