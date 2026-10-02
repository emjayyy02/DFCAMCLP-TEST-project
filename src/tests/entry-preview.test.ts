import { describe, expect, it } from "vitest";
import {
  previewImageLimit,
  validatePreviewImage,
} from "../features/identity/preview-rules";
describe("Local preview image validation", () => {
  it.each(["image/png", "image/jpeg", "image/webp"])(
    "accepts %s at the size limit",
    (type) => {
      expect(
        validatePreviewImage({ type, size: previewImageLimit }),
      ).toBeNull();
    },
  );
  it.each(["image/gif", "image/svg+xml", "text/plain", ""])(
    "rejects unsupported type %s",
    (type) => {
      expect(validatePreviewImage({ type, size: 100 })).toMatch(/PNG/);
    },
  );
  it.each([0, previewImageLimit + 1])("rejects invalid size %i", (size) => {
    expect(validatePreviewImage({ type: "image/png", size })).toMatch(/5 MB/);
  });
});
