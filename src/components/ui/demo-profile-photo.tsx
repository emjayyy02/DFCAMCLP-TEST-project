"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/identity";

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxImageSize = 2 * 1024 * 1024;

export function DemoProfilePhotoPicker({
  id,
  name,
  src,
  onSelect,
  domain = false,
}: {
  id: string;
  name: string;
  src?: string;
  onSelect: (file: File | null) => void;
  domain?: boolean;
}) {
  const [error, setError] = useState<string>();
  const [staged, setStaged] = useState<{ file: File; url: string }>();
  const [decoding, setDecoding] = useState(false);
  const [message, setMessage] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const choose = useRef<HTMLButtonElement>(null);
  const stagedUrl = useRef<string | undefined>(undefined);
  const request = useRef(0);

  function discard() {
    request.current++;
    if (stagedUrl.current) URL.revokeObjectURL(stagedUrl.current);
    stagedUrl.current = undefined;
    setStaged(undefined);
    setError(undefined);
    setDecoding(false);
  }
  useEffect(
    () => () => {
      request.current++;
      if (stagedUrl.current) URL.revokeObjectURL(stagedUrl.current);
    },
    [],
  );

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    const ticket = ++request.current;
    setDecoding(false);
    if (!acceptedImageTypes.includes(file.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > maxImageSize) {
      setError("Choose an image up to 2 MB.");
      return;
    }
    setError(undefined);
    setDecoding(true);
    const url = URL.createObjectURL(file);
    try {
      const image = new window.Image();
      image.src = url;
      await image.decode();
      if (request.current !== ticket || !dialog.current?.open) {
        URL.revokeObjectURL(url);
        return;
      }
      if (stagedUrl.current) URL.revokeObjectURL(stagedUrl.current);
      stagedUrl.current = url;
      setStaged({ file, url });
      setDecoding(false);
    } catch {
      URL.revokeObjectURL(url);
      if (request.current === ticket) {
        setError(
          "This image could not be opened. Choose another JPEG, PNG, or WebP.",
        );
        setDecoding(false);
      }
    }
  }
  function close() {
    dialog.current?.close();
  }
  function apply(remove = false) {
    onSelect(remove ? null : staged!.file);
    setMessage(
      remove ? "Demo photo removed." : "Demo photo updated in this tab.",
    );
    close();
  }
  return (
    <div className="demo-photo-control">
      <Avatar name={name} src={src} size="large" />
      <button
        ref={trigger}
        type="button"
        className="demo-photo-trigger"
        aria-label={src ? "Change demo photo" : "Add demo photo"}
        aria-haspopup="dialog"
        onClick={() => {
          discard();
          dialog.current?.showModal();
          choose.current?.focus();
        }}
      >
        <span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <span className="sr-only" role="status">
        {message}
      </span>
      <dialog
        ref={dialog}
        className="demo-photo-dialog"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-help`}
        onClose={() => {
          discard();
          trigger.current?.focus();
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>(
              "button:not([disabled])",
            ),
          ).filter((node) => node.getClientRects().length);
          const first = controls[0],
            last = controls.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
      >
        <div className="demo-photo-dialog-body">
          <h2 id={`${id}-title`}>
            {domain ? "Sample profile photo" : "Demo profile photo"}
          </h2>
          <p id={`${id}-help`}>
            {domain
              ? "Shared with your account in this tab. Not uploaded or saved. Resets on reload or sign-out."
              : "Shown only in this tab. Not uploaded or saved. Resets on reload or sign-out."}
          </p>
          <p className="demo-photo-formats">JPEG, PNG, or WebP · up to 2 MB.</p>
          <div className="demo-photo-preview">
            <Avatar name={name} src={staged?.url ?? src} size="large" />
          </div>
          <input
            ref={input}
            id={id}
            type="file"
            hidden
            accept="image/jpeg,image/png,image/webp"
            aria-label="Choose demo profile image"
            onChange={handleChange}
          />
          <Button
            ref={choose}
            type="button"
            variant="outline"
            onClick={() => input.current?.click()}
          >
            Choose image
          </Button>
          <p role="status">
            {decoding
              ? "Opening image…"
              : staged
                ? "Preview ready. Use photo to apply it in this tab."
                : ""}
          </p>
          {error ? (
            <p id={`${id}-error`} role="alert" className="demo-photo-error">
              {error}
            </p>
          ) : null}
        </div>
        <div className="demo-photo-dialog-actions">
          {src ? (
            <Button
              type="button"
              variant="tertiary"
              onClick={() => apply(true)}
            >
              Remove photo
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!staged || decoding || Boolean(error)}
            onClick={() => apply()}
          >
            Use photo
          </Button>
        </div>
      </dialog>
    </div>
  );
}
