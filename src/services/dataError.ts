export type DataErrorCode = "VALIDATION" | "CATEGORY_EXISTS" | "NOT_FOUND";

export const DATA_MESSAGES = {
  CATEGORY_EXISTS: "You already have a category with that name.",
  CATEGORY_NOT_FOUND: "That category no longer exists.",
  NOTE_NOT_FOUND: "That note no longer exists.",
  NOTHING_CHANGED: "Change something before saving.",
} as const;

export class DataError extends Error {
  readonly code: DataErrorCode;

  constructor(code: DataErrorCode, message: string) {
    super(message);
    this.name = "DataError";
    this.code = code;
  }
}
