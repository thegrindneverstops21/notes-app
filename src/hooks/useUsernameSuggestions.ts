import { useEffect, useState } from "react";
import { suggestUsernames } from "../services/authService";

export function useUsernameSuggestions(email: string): string[] {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    suggestUsernames(email)
      .then((names) => {
        if (!cancelled) setSuggestions(names);
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [email]);

  return suggestions;
}
