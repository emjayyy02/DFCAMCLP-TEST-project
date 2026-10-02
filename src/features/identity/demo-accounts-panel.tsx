"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { DemoAccountOption } from "./public-demo-accounts";

export function DemoAccountsPanel({
  accounts,
  onUseEmail,
}: {
  accounts: readonly DemoAccountOption[];
  onUseEmail: (email: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const selectedEmail = useRef<string | null>(null);
  const copyRequest = useRef(0);
  const [message, setMessage] = useState("");

  async function copyEmail(email: string) {
    const request = ++copyRequest.current;
    try {
      await navigator.clipboard.writeText(email);
      if (request === copyRequest.current) setMessage(`Copied ${email}.`);
    } catch {
      if (request === copyRequest.current)
        setMessage(
          "Copy is unavailable. Select and copy the email shown in the list.",
        );
    }
  }

  return (
    <div>
      <Button
        ref={trigger}
        type="button"
        variant="outline"
        className="w-full"
        aria-haspopup="dialog"
        onClick={() => {
          if (document.querySelector("dialog[open]")) return;
          selectedEmail.current = null;
          copyRequest.current++;
          setMessage("");
          dialog.current?.showModal();
          title.current?.focus({ preventScroll: true });
        }}
      >
        View demo accounts
      </Button>
      <dialog
        ref={dialog}
        className="demo-accounts-dialog"
        aria-labelledby="demo-accounts-title"
        aria-describedby="demo-accounts-description"
        onCancel={(event) => event.stopPropagation()}
        onClose={() => {
          copyRequest.current++;
          const email = selectedEmail.current;
          selectedEmail.current = null;
          if (email) onUseEmail(email);
          else trigger.current?.focus({ preventScroll: true });
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const buttons = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>(
              "button:not([disabled])",
            ),
          );
          const first = buttons[0],
            last = buttons.at(-1);
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
        <header className="demo-accounts-header">
          <h2 ref={title} id="demo-accounts-title" tabIndex={-1}>
            Demo accounts
          </h2>
          <p id="demo-accounts-description">
            Choose a fictional identity to explore its portals. You still need
            to sign in.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => dialog.current?.close()}
          >
            Close
          </Button>
        </header>
        <div className="demo-accounts-body">
          <ul className="demo-accounts-list">
            {accounts.map((account) => (
              <li key={account.email} className="demo-account-row">
                <div className="demo-account-copy">
                  <h3>{account.label}</h3>
                  <p className="demo-account-email">{account.email}</p>
                  <p className="demo-account-portals">
                    Portals: {account.portals.join(" · ")}
                  </p>
                </div>
                <div className="demo-account-actions">
                  <Button
                    type="button"
                    variant="outline"
                    aria-label={`Copy email for ${account.label}`}
                    onClick={() => copyEmail(account.email)}
                  >
                    Copy email
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label={`Use this account: ${account.label}`}
                    onClick={() => {
                      selectedEmail.current = account.email;
                      dialog.current?.close();
                    }}
                  >
                    Use this account
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <footer className="demo-accounts-footer">
          <p role="status">
            {message ||
              "Use this account fills the email only. Choose your portal and sign in normally."}
          </p>
        </footer>
      </dialog>
    </div>
  );
}
