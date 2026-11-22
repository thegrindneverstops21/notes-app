export const FEEDBACK = {
  NOTE_SAVED: "Note saved.",
  NOTE_UPDATED: "Changes saved.",
  NOTE_DELETED: "Note deleted.",
  CATEGORY_ADDED: "Category added.",
  CATEGORY_RENAMED: "Category renamed.",
  CATEGORY_DELETED: "Category deleted.",
  PROFILE_UPDATED: "Profile updated.",
} as const;

export const PROBLEMS = {
  LOAD_FAILED: "We could not load your notes. Try again.",
  STORAGE: "We could not read or save your data on this phone. Try again.",
  CRASH: "Something broke on this screen. Try again.",
  PAGE_NOT_FOUND: "That page does not exist.",
} as const;
