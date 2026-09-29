"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FieldError,
  FieldHelp,
  FieldLabel,
  Input,
} from "@/components/ui/input";

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxImageSize = 2 * 1024 * 1024;

export function useDemoProfilePhoto() {
  const [previewUrl, setPreviewUrl] = useState<string>();
  const previewUrlRef = useRef<string | undefined>(undefined);

  const setPhoto = useCallback((file: File | null) => {
    const previousUrl = previewUrlRef.current;
    const nextUrl = file ? URL.createObjectURL(file) : undefined;
    previewUrlRef.current = nextUrl;
    setPreviewUrl(nextUrl);
    if (previousUrl) URL.revokeObjectURL(previousUrl);
  }, []);

  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  return [previewUrl, setPhoto] as const;
}

export function DemoProfilePhotoPicker({
  id,
  hasPhoto,
  onSelect,
}: {
  id: string;
  hasPhoto: boolean;
  onSelect: (file: File | null) => void;
}) {
  const [error, setError] = useState<string>();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    if (!acceptedImageTypes.includes(file.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > maxImageSize) {
      setError("Choose an image smaller than 2 MB.");
      return;
    }

    setError(undefined);
    onSelect(file);
  }

  function removePhoto() {
    setError(undefined);
    onSelect(null);
  }

  return (
    <div className="demo-profile-photo-picker">
      <FieldLabel htmlFor={id}>Profile photo</FieldLabel>
      <div className="demo-profile-photo-actions">
        <Input
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`}
          aria-invalid={error ? true : undefined}
          onChange={handleChange}
        />
        {hasPhoto ? (
          <Button type="button" variant="tertiary" onClick={removePhoto}>
            Remove photo
          </Button>
        ) : null}
      </div>
      <FieldHelp id={`${id}-help`}>
        JPEG, PNG, or WebP · up to 2 MB. Preview only; not uploaded or saved. It
        resets on refresh.
      </FieldHelp>
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </div>
  );
}
