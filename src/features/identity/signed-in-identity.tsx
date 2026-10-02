"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAccountPresentation } from "./demo-presentation-provider";

export type SignedInIdentity = { id: string; name: string; email: string };
const IdentityContext = createContext<SignedInIdentity | null>(null);

export function SignedInIdentityProvider({
  user,
  children,
}: {
  user: SignedInIdentity;
  children: ReactNode;
}) {
  return <IdentityContext value={user}>{children}</IdentityContext>;
}

export function useSignedInIdentity() {
  const user = useContext(IdentityContext);
  if (!user) throw new Error("Signed-in identity requires its guarded layout.");
  return user;
}

export function useIdentityPhoto() {
  const user = useSignedInIdentity();
  const { photo, setPhoto } = useAccountPresentation(user.id);
  return [photo, setPhoto] as const;
}
