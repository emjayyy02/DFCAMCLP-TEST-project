import { portalCodes, portalPath, type PortalCode } from "../../lib/portals";
import { canEnterPortal, type AccessContext } from "./service";

export function authorizedPrimaryPortal(
  context: AccessContext,
  requested?: PortalCode | null,
) {
  if (requested && canEnterPortal(context, requested)) return requested;
  return portalCodes.find((portal) => canEnterPortal(context, portal)) ?? null;
}
export function profilePath(portal: PortalCode) {
  return `${portalPath(portal)}/profile`;
}
