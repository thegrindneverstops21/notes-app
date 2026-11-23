// A note body is plain text. Each line may start with a marker:
//   "[ ] " or "[x] " checklist item, "# " heading, "• " bullet. No marker = plain text.
// Storing markers in the text keeps search, previews and old notes working.

export type BlockKind = "text" | "heading" | "bullet" | "check";

export type Block = {
  id: string;
  kind: BlockKind;
  text: string;
  checked: boolean;
};

const MARKERS = {
  heading: "# ",
  bullet: "• ",
  unchecked: "[ ] ",
  checked: "[x] ",
} as const;

// "- " or "[] " typed at the start of a plain line turns it into a checklist item.
const CHECK_SHORTCUT = /^(?:-|\[\s?\])\s/;

export type NewId = () => string;

function parseLine(line: string, id: string): Block {
  const lower = line.toLowerCase();
  if (lower.startsWith(MARKERS.checked)) {
    return { id, kind: "check", text: line.slice(MARKERS.checked.length), checked: true };
  }
  if (line.startsWith(MARKERS.unchecked)) {
    return { id, kind: "check", text: line.slice(MARKERS.unchecked.length), checked: false };
  }
  if (line.startsWith(MARKERS.heading)) {
    return { id, kind: "heading", text: line.slice(MARKERS.heading.length), checked: false };
  }
  if (line.startsWith(MARKERS.bullet)) {
    return { id, kind: "bullet", text: line.slice(MARKERS.bullet.length), checked: false };
  }
  return { id, kind: "text", text: line, checked: false };
}

export function parseBody(body: string, newId: NewId): Block[] {
  return body.split("\n").map((line) => parseLine(line, newId()));
}

function serializeBlock(block: Block): string {
  if (block.kind === "check") {
    return (block.checked ? MARKERS.checked : MARKERS.unchecked) + block.text;
  }
  if (block.kind === "heading") return MARKERS.heading + block.text;
  if (block.kind === "bullet") return MARKERS.bullet + block.text;
  return block.text;
}

export function serializeBlocks(blocks: Block[]): string {
  return blocks.map(serializeBlock).join("\n");
}

// Returns the converted block when a shortcut was typed, otherwise null.
export function applyShortcut(block: Block, nextText: string): Block | null {
  if (block.kind !== "text" || !CHECK_SHORTCUT.test(nextText)) return null;
  const text = nextText.replace(CHECK_SHORTCUT, "");
  return { ...block, kind: "check", text, checked: false };
}

// Kind of the line that follows after pressing Enter.
function continuedKind(kind: BlockKind): BlockKind {
  return kind === "check" || kind === "bullet" ? kind : "text";
}

// The text of a block changed. If it now contains line breaks, split it into several blocks.
// Enter on an empty list item ends the list instead of adding another empty item.
export function applyTextChange(
  blocks: Block[],
  index: number,
  nextText: string,
  newId: NewId,
): { blocks: Block[]; focusId: string } {
  const current = blocks[index];
  if (!current) return { blocks, focusId: "" };

  const shortcut = applyShortcut(current, nextText);
  if (shortcut) {
    return { blocks: blocks.map((b, i) => (i === index ? shortcut : b)), focusId: current.id };
  }

  const pieces = nextText.split("\n");
  if (pieces.length === 1) {
    return {
      blocks: blocks.map((b, i) => (i === index ? { ...b, text: nextText } : b)),
      focusId: current.id,
    };
  }

  const endsList =
    pieces[0] === "" &&
    continuedKind(current.kind) !== "text" &&
    pieces.length === 2 &&
    pieces[1] === "";
  if (endsList) {
    return {
      blocks: blocks.map((b, i) =>
        i === index ? { ...b, kind: "text", checked: false, text: "" } : b,
      ),
      focusId: current.id,
    };
  }

  const kind = continuedKind(current.kind);
  const head: Block = { ...current, text: pieces[0] ?? "" };
  const tail: Block[] = pieces
    .slice(1)
    .map((text) => ({ id: newId(), kind, text, checked: false }));
  const next = [...blocks.slice(0, index), head, ...tail, ...blocks.slice(index + 1)];
  return { blocks: next, focusId: tail[tail.length - 1]?.id ?? current.id };
}

export function setKind(blocks: Block[], id: string, kind: BlockKind): Block[] {
  return blocks.map((block) => {
    if (block.id !== id) return block;
    const nextKind = block.kind === kind ? "text" : kind;
    return { ...block, kind: nextKind, checked: nextKind === "check" ? block.checked : false };
  });
}

export function toggleChecked(blocks: Block[], id: string): Block[] {
  return blocks.map((block) => (block.id === id ? { ...block, checked: !block.checked } : block));
}

// Backspace on an empty line: a list or heading becomes plain text, plain text is removed.
export function backspaceEmpty(
  blocks: Block[],
  id: string,
): { blocks: Block[]; focusId: string } | null {
  const index = blocks.findIndex((block) => block.id === id);
  const block = blocks[index];
  if (!block || block.text !== "") return null;
  if (block.kind !== "text") {
    return {
      blocks: blocks.map((b, i) => (i === index ? { ...b, kind: "text", checked: false } : b)),
      focusId: id,
    };
  }
  const previous = blocks[index - 1];
  if (!previous) return null;
  return { blocks: blocks.filter((_, i) => i !== index), focusId: previous.id };
}

export type Progress = { done: number; total: number };

// Counts checklist items. Null when the note has none.
export function checklistProgress(body: string): Progress | null {
  const lines = body.split("\n").map((line) => parseLine(line, ""));
  const items = lines.filter((line) => line.kind === "check");
  if (items.length === 0) return null;
  return { done: items.filter((item) => item.checked).length, total: items.length };
}

// Readable text for a card preview: markers become simple symbols.
export function previewText(body: string): string {
  return body
    .split("\n")
    .map((line) => parseLine(line, ""))
    .map((block) => {
      if (block.kind === "check") return `${block.checked ? "☑" : "☐"} ${block.text}`;
      if (block.kind === "bullet") return `• ${block.text}`;
      return block.text;
    })
    .join("\n");
}

// The text of a note without any markers, for searching.
export function plainText(body: string): string {
  return body
    .split("\n")
    .map((line) => parseLine(line, "").text)
    .join("\n");
}