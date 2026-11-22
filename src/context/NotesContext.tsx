import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createCategory,
  deleteCategory,
  listCategories,
  renameCategory,
} from "../services/categoryService";
import {
  createNote,
  deleteNote,
  listNotes,
  updateNote,
} from "../services/noteService";
import type { Category, Note, NoteChanges, NoteInput } from "../types";

type NotesStatus = "loading" | "ready" | "error";
type Reload = () => Promise<void>;
type NotesState = {
  status: NotesStatus;
  categories: Category[];
  notes: Note[];
};

const LOADING_STATE: NotesState = {
  status: "loading",
  categories: [],
  notes: [],
};
const ERROR_STATE: NotesState = { status: "error", categories: [], notes: [] };

// Plain data fetch with no state setting, so effects can call it safely.
async function fetchAll(userId: string) {
  const [categories, notes] = await Promise.all([
    listCategories(userId),
    listNotes(userId),
  ]);
  return { categories, notes };
}

function withReload(reload: Reload) {
  return async function run<T>(work: Promise<T>): Promise<T> {
    const result = await work;
    await reload();
    return result;
  };
}

function createActions(userId: string, reload: Reload) {
  const run = withReload(reload);
  return {
    addCategory: (name: string) => run(createCategory(userId, name)),
    renameCategory: (id: string, name: string) =>
      run(renameCategory(userId, id, name)),
    removeCategory: (id: string) => run(deleteCategory(userId, id)),
    addNote: (input: NoteInput) => run(createNote(userId, input)),
    editNote: (id: string, changes: NoteChanges) =>
      run(updateNote(userId, id, changes)),
    removeNote: (id: string) => run(deleteNote(userId, id)),
  };
}

type NotesContextValue = NotesState &
  ReturnType<typeof createActions> & { retry: () => Promise<void> };

const NotesContext = createContext<NotesContextValue | null>(null);

export function NotesProvider({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  const [state, setState] = useState<NotesState>(LOADING_STATE);

  const reload = useCallback<Reload>(async () => {
    setState({ status: "ready", ...(await fetchAll(userId)) });
  }, [userId]);

  const retry = useCallback(async () => {
    setState(LOADING_STATE);
    try {
      await reload();
    } catch {
      setState(ERROR_STATE);
    }
  }, [reload]);

  useEffect(() => {
    let cancelled = false;
    fetchAll(userId)
      .then((data) => {
        if (!cancelled) setState({ status: "ready", ...data });
      })
      .catch(() => {
        if (!cancelled) setState(ERROR_STATE);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const value = useMemo(
    () => ({ ...state, retry, ...createActions(userId, reload) }),
    [state, retry, userId, reload],
  );

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

export function useNotes(): NotesContextValue {
  const value = useContext(NotesContext);
  if (!value) throw new Error("useNotes must be used inside NotesProvider");
  return value;
}
