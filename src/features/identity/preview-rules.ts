export const previewImageLimit = 5 * 1024 * 1024;
export function validatePreviewImage(file: { type: string; size: number }) {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type))
    return "Choose a PNG, JPEG, or WebP image.";
  if (file.size === 0 || file.size > previewImageLimit)
    return "Choose an image between 1 byte and 5 MB.";
  return null;
}
export const supportIssues = [
  "Forgot password",
  "Cannot sign in",
  "Account locked",
  "Wrong account information",
  "Portal access problem",
  "Other",
] as const;
