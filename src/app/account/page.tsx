import { forbidden, redirect } from "next/navigation";
import { getCurrentAccessContext } from "@/server/access-control/current";
import {
  authorizedPrimaryPortal,
  profilePath,
} from "@/server/access-control/profile-navigation";

export default async function AccountPage() {
  const current = await getCurrentAccessContext();
  if (!current) redirect("/login");
  const portal = authorizedPrimaryPortal(current);
  if (!portal) forbidden();
  redirect(profilePath(portal));
}
