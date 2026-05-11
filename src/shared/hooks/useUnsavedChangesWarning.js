import { useEffect } from "react";

export function useUnsavedChangesWarning(shouldWarn) {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!shouldWarn) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldWarn]);
}