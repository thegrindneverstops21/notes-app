import type { ReactNode } from "react";
import { ErrorState } from "@/components/ErrorState";
import { NotesSkeleton } from "@/components/NotesSkeleton";
import { Screen } from "@/components/Screen";
import { PROBLEMS } from "@/constants/messages";
import { useNotes } from "@/context/NotesContext";

export function NotesGate({ children }: { children: ReactNode }) {
  const { status, retry } = useNotes();

  if (status === "loading") {
    return (
      <Screen>
        <NotesSkeleton />
      </Screen>
    );
  }
  if (status === "error") {
    return (
      <Screen>
        <ErrorState message={PROBLEMS.LOAD_FAILED} onRetry={retry} />
      </Screen>
    );
  }
  return <>{children}</>;
}
