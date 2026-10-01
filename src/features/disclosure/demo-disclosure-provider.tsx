"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  acknowledgementKey,
  disclosureVersion,
  disclosureParagraphs,
  legalLinks,
  isInformationRoute,
} from "./disclosure-content";

type DisclosureState = {
  ready: boolean;
  acknowledged: boolean;
  mode: "entry" | "manual" | null;
  returnPath: string;
  message: string;
};
const initial: DisclosureState = {
  ready: false,
  acknowledged: false,
  mode: null,
  returnPath: "/",
  message: "",
};
function createStore() {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => state,
    getServerSnapshot: () => initial,
    update(change: Partial<DisclosureState>) {
      state = { ...state, ...change };
      listeners.forEach((listener) => listener());
    },
  };
}
type DisclosureContextValue = {
  state: DisclosureState;
  open: (trigger?: HTMLElement | null) => void;
  information: () => void;
};
const DisclosureContext = createContext<DisclosureContextValue | null>(null);
function useDisclosure() {
  const value = useContext(DisclosureContext);
  if (!value) throw new Error("Disclosure requires its root provider.");
  return value;
}

export function DisclosureParagraphs() {
  return disclosureParagraphs.map((paragraph) => (
    <p key={paragraph}>{paragraph}</p>
  ));
}

export function DemoDisclosureProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createStore);
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  const pathname = usePathname();
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const lastRoute = useRef<string | null>(null);
  const lastNormal = useRef("/");

  useEffect(() => {
    if (!store.getSnapshot().ready) {
      let acknowledged = false;
      try {
        acknowledged =
          localStorage.getItem(acknowledgementKey) === disclosureVersion;
      } catch {
        /* Memory fallback remains usable. */
      }
      store.update({ ready: true, acknowledged });
    }
    const previous = lastRoute.current;
    const legal = isInformationRoute(pathname);
    if (legal) {
      store.update({ mode: null, returnPath: lastNormal.current });
    } else {
      lastNormal.current =
        window.location.pathname +
        window.location.search +
        window.location.hash;
      if (
        (previous === null || isInformationRoute(previous)) &&
        !store.getSnapshot().acknowledged
      ) {
        returnFocus.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        store.update({ mode: "entry" });
      }
    }
    lastRoute.current = pathname;
  }, [pathname, store]);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (state.mode && !element.open) {
      element.showModal();
      title.current?.focus();
    }
    if (!state.mode && element.open) element.close();
  }, [state.mode]);

  function restoreFocus() {
    const candidate = returnFocus.current;
    if (
      candidate?.isConnected &&
      candidate !== document.body &&
      !candidate.closest("[inert]") &&
      !candidate.matches(":disabled")
    )
      candidate.focus();
    else {
      const main = document.querySelector<HTMLElement>("#main h1, #main");
      if (main) {
        if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
      }
    }
  }
  function close() {
    dialog.current?.close();
    store.update({ mode: null });
    restoreFocus();
  }
  function information() {
    if (!isInformationRoute(window.location.pathname))
      lastNormal.current =
        window.location.pathname +
        window.location.search +
        window.location.hash;
    dialog.current?.close();
    store.update({ mode: null, returnPath: lastNormal.current });
  }
  function leave() {
    information();
    router.push("/disclaimer");
  }
  function acknowledge() {
    let message = "";
    try {
      localStorage.setItem(acknowledgementKey, disclosureVersion);
    } catch {
      message =
        "Understood for this visit. Your browser could not remember this choice.";
    }
    store.update({ acknowledged: true, message });
    close();
  }
  return (
    <DisclosureContext
      value={{
        state,
        information,
        open: (trigger) => {
          returnFocus.current =
            trigger ??
            (document.activeElement instanceof HTMLElement
              ? document.activeElement
              : null);
          store.update({ mode: "manual" });
        },
      }}
    >
      {!isInformationRoute(pathname) && (
        <noscript>
          <aside
            className="disclosure-fallback"
            aria-labelledby="static-disclosure-title"
          >
            <h2 id="static-disclosure-title">About this demo</h2>
            <DisclosureParagraphs />
            <nav aria-label="Project information">
              {legalLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.title}
                </a>
              ))}
            </nav>
            <a href="#main">Continue to page content</a>
          </aside>
        </noscript>
      )}
      {children}
      <p className="sr-only" role="status">
        {state.message}
      </p>
      <dialog
        ref={dialog}
        className="demo-disclosure-dialog"
        aria-labelledby="demo-disclosure-title"
        aria-describedby="demo-disclosure-summary"
        onCancel={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (state.mode === "entry") leave();
          else close();
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              "a[href], button:not([disabled])",
            ),
          ).filter((node) => node.getClientRects().length);
          const first = controls[0],
            last = controls.at(-1);
          if (
            event.shiftKey &&
            (document.activeElement === first ||
              document.activeElement === title.current)
          ) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
      >
        <div className="demo-disclosure-body">
          <h2 ref={title} tabIndex={-1} id="demo-disclosure-title">
            About this demo
          </h2>
          <p id="demo-disclosure-summary" className="sr-only">
            Project purpose, fictional records, and temporary demo behavior.
          </p>
          <DisclosureParagraphs />
          <nav aria-label="Read project notices">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} onNavigate={information}>
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="demo-disclosure-actions">
          {state.mode === "entry" ? (
            <>
              <Link href="/disclaimer" onNavigate={information}>
                Leave demo
              </Link>
              <Button onClick={acknowledge}>I understand — Enter demo</Button>
            </>
          ) : (
            <Button onClick={close}>Close</Button>
          )}
        </div>
      </dialog>
    </DisclosureContext>
  );
}

export function AboutDemoButton({
  className,
  onOpen,
  focusTarget,
}: {
  className?: string;
  onOpen?: () => void;
  focusTarget?: () => HTMLElement | null;
}) {
  const { state, open } = useDisclosure();
  return (
    <button
      type="button"
      hidden={!state.ready}
      className={className ?? "about-demo-button"}
      aria-haspopup="dialog"
      onClick={(event) => {
        const trigger = focusTarget?.() ?? event.currentTarget;
        onOpen?.();
        open(trigger);
      }}
    >
      About this demo
    </button>
  );
}
export function ProjectInformationLinks() {
  const { information } = useDisclosure();
  return (
    <div className="project-footer-information">
      <p>Independent portfolio demo.</p>
      <nav aria-label="Project information">
        {legalLinks.map((link, index) => (
          <Link key={link.href} href={link.href} onNavigate={information}>
            {["Disclaimer", "Terms", "Privacy", "Acceptable Use"][index]}
          </Link>
        ))}
        <AboutDemoButton />
      </nav>
    </div>
  );
}
export function ReturnToDemo() {
  const { state } = useDisclosure();
  return (
    <Link className="text-link return-to-demo" href={state.returnPath}>
      Return to demo
    </Link>
  );
}
