import { z } from "zod";

const schema = z
  .object({
    APP_ENV: z.enum(["development", "test", "preview", "production"]),
    APP_URL: z.url(),
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    AUTH_SEED_PASSWORD: z.string().min(12).optional(),
    DATABASE_URL: z
      .string()
      .url()
      .refine((value) => {
        if (!URL.canParse(value)) return false;
        const url = new URL(value);
        return (
          ["postgres:", "postgresql:"].includes(url.protocol) &&
          !!url.hostname &&
          !!url.username &&
          !!url.password &&
          url.pathname.length > 1
        );
      }),
  })
  .superRefine((value, context) => {
    if (
      ["preview", "production"].includes(value.APP_ENV) &&
      (!URL.canParse(value.APP_URL) ||
        new URL(value.APP_URL).protocol !== "https:")
    ) {
      context.addIssue({
        code: "custom",
        path: ["APP_URL"],
        message: "HTTPS required",
      });
    }

    if (
      ["preview", "production"].includes(value.APP_ENV) &&
      (!URL.canParse(value.BETTER_AUTH_URL) ||
        new URL(value.BETTER_AUTH_URL).protocol !== "https:")
    ) {
      context.addIssue({
        code: "custom",
        path: ["BETTER_AUTH_URL"],
        message: "HTTPS required",
      });
    }

    if (
      ["preview", "production"].includes(value.APP_ENV) &&
      /local|development|change|example|placeholder/i.test(
        value.BETTER_AUTH_SECRET,
      )
    ) {
      context.addIssue({
        code: "custom",
        path: ["BETTER_AUTH_SECRET"],
        message: "Production auth secret must be unique",
      });
    }

    if (
      value.AUTH_SEED_PASSWORD &&
      ["preview", "production"].includes(value.APP_ENV)
    ) {
      context.addIssue({
        code: "custom",
        path: ["AUTH_SEED_PASSWORD"],
        message: "Development seed passwords are not allowed",
      });
    }
  });

export function parseServerEnv(input: Record<string, string | undefined>) {
  const result = schema.safeParse(input);
  if (!result.success) {
    const fields = [
      ...new Set(result.error.issues.map((issue) => issue.path.join("."))),
    ];
    // Report field names only. Zod input values can contain credentials.
    throw new Error(`Invalid server environment fields: ${fields.join(", ")}`);
  }
  return result.data;
}
