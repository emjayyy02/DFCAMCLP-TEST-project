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

const disclosurePoints = [
  { heading: "Unofficial project", symbol: "important" },
  { heading: "Fictional demonstration data", symbol: "sample" },
  { heading: "Do not enter real information", symbol: "prohibited" },
  { heading: "Temporary demo state", symbol: "reset" },
] as const;

function DisclosureSymbol({
  kind,
}: {
  kind: "important" | "sample" | "prohibited" | "reset";
}) {
  return (
    <svg
      className="demo-disclosure-symbol"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {kind === "sample" ? (
        <>
          <path d="M12 3 22 21H2Z" className="disclosure-symbol-accent" />
          <path d="M12 9v5m0 3v.25" />
        </>
      ) : kind === "reset" ? (
        <>
          <path d="M4 10a8 8 0 1 1 .5 7M4 4v6h6" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="9" />
          {kind === "important" ? (
            <path d="M12 7v6m0 4v.25" />
          ) : (
            <path d="m8.5 8.5 7 7m0-7-7 7" />
          )}
        </>
      )}
    </svg>
  );
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
      try {
        // Remove acknowledgement left by earlier releases; never read or persist it.
        localStorage.removeItem("dfcamclp.demoDisclosure.ackVersion");
      } catch {
        /* Disclosure state stays in memory even when storage is unavailable. */
      }
      store.update({ ready: true });
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
    store.update({ acknowledged: true });
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
              <Link href="/about-developer">About the developer</Link>
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
          <header className="demo-disclosure-header">
            <DisclosureSymbol kind="sample" />
            <h2 ref={title} tabIndex={-1} id="demo-disclosure-title">
              About this demo
            </h2>
            <p id="demo-disclosure-summary">
              Please review these project boundaries before exploring the demo.
            </p>
          </header>
          <ul className="demo-disclosure-points">
            {disclosurePoints.map((point, index) => (
              <li key={point.heading} className="demo-disclosure-point">
                <DisclosureSymbol kind={point.symbol} />
                <div>
                  <h3>{point.heading}</h3>
                  <p>
                    {index === 2
                      ? disclosureParagraphs[index].replace(
                          ", or institutional information",
                          ", confidential, or institutional information",
                        )
                      : disclosureParagraphs[index]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <h3
            className="demo-disclosure-resources"
            id="demo-disclosure-resources"
          >
            Learn more
          </h3>
          <nav aria-labelledby="demo-disclosure-resources">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} onNavigate={information}>
                {link.title}
              </Link>
            ))}
            <Link href="/about-developer" onNavigate={information}>
              About the developer
            </Link>
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
        <Link href="/about-developer" onNavigate={information}>
          About the developer
        </Link>
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
