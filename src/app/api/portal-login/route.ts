import { NextRequest, NextResponse } from "next/server";
import { isPortalCode } from "@/lib/portals";
import { auth } from "@/server/auth/auth";
import { signInToPortal } from "@/server/access-control/portal-login";
import { db } from "@/server/db";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Sign in could not be completed. Try again." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { message: "Complete the portal, email, and password fields." },
      { status: 400 },
    );
  }

  const input = body as Record<string, unknown>;
  if (
    typeof input.email !== "string" ||
    typeof input.password !== "string" ||
    typeof input.portal !== "string" ||
    !isPortalCode(input.portal)
  ) {
    return NextResponse.json(
      { message: "Complete the portal, email, and password fields." },
      { status: 400 },
    );
  }

  const result = await signInToPortal(
    auth,
    db,
    {
      email: input.email.trim(),
      password: input.password,
      portal: input.portal,
    },
    request.headers,
  );

  if (result.status === "invalid-credentials") {
    return NextResponse.json(
      { message: "Invalid email or password." },
      { status: 401 },
    );
  }

  if (result.status === "portal-denied") {
    return NextResponse.json(
      { message: "This account does not have access to the selected portal." },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ redirectTo: result.redirectTo });
  if (result.setCookie) response.headers.set("set-cookie", result.setCookie);
  response.headers.set("cache-control", "no-store");
  return response;
}
