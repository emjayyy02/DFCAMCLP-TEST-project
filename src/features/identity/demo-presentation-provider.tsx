"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

type Presentation = { userId: string | null; bio: string; photo?: string };
const empty: Presentation = { userId: null, bio: "" };

// Presentation only. Never a session, membership, or authorization source.
function createPresentationStore() {
  let value = empty;
  const listeners = new Set<() => void>();
  function publish(next: Presentation) {
    if (value.photo && value.photo !== next.photo)
      URL.revokeObjectURL(value.photo);
    value = next;
    listeners.forEach((listener) => listener());
  }
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => value,
    getServerSnapshot: () => empty,
    bind(userId: string) {
      if (value.userId !== userId) publish({ userId, bio: "" });
    },
    clear() {
      publish(empty);
    },
    bio(userId: string, bio: string) {
      if (value.userId === userId) publish({ ...value, bio });
    },
    photo(userId: string, file: File | null) {
      if (value.userId === userId)
        publish({
          ...value,
          photo: file ? URL.createObjectURL(file) : undefined,
        });
    },
  };
}
const PresentationContext = createContext<ReturnType<
  typeof createPresentationStore
> | null>(null);

export function DemoPresentationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [store] = useState(createPresentationStore);
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/login") store.clear();
  }, [pathname, store]);
  useEffect(() => () => store.clear(), [store]);
  return <PresentationContext value={store}>{children}</PresentationContext>;
}

export function usePresentationStore() {
  const store = useContext(PresentationContext);
  if (!store) throw new Error("Demo presentation requires its root provider.");
  return store;
}

export function useAccountPresentation(userId: string) {
  const store = usePresentationStore();
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  useEffect(() => {
    store.bind(userId);
  }, [store, userId]);
  // The ID check also protects the render before the binding effect runs.
  return {
    bio: state.userId === userId ? state.bio : "",
    photo: state.userId === userId ? state.photo : undefined,
    setBio: (bio: string) => store.bio(userId, bio),
    setPhoto: (file: File | null) => store.photo(userId, file),
  };
}
