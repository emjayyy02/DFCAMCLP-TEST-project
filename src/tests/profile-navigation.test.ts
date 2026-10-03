import { describe, expect, it } from "vitest";
import { portalCodes } from "../lib/portals";
import {
  authorizedPrimaryPortal,
  profilePath,
} from "../server/access-control/profile-navigation";
import {
  canAccessPortalPath,
  type AccessContext,
} from "../server/access-control/service";
import { permittedNavigation } from "../server/access-control/navigation";
import type { PermissionCode } from "../server/access-control/seed-data";

function context(portals: (typeof portalCodes)[number][], allowed = true) {
  return {
    memberships: portals.map((portal) => ({
      portal,
      permissions: allowed ? [`${portal.toLowerCase()}.portal.view`] : [],
      roles: [],
    })),
  } as unknown as AccessContext;
}
describe("unified profile authorization and navigation", () => {
  it.each(portalCodes)(
    "uses only %s portal-view permission and finishes its sidebar with Profile",
    (portal) => {
      const permission =
        `${portal.toLowerCase()}.portal.view` as PermissionCode;
      const current = context([portal]);
      expect(canAccessPortalPath(current, portal, profilePath(portal))).toBe(
        true,
      );
      expect(
        canAccessPortalPath(
          context([portal], false),
          portal,
          profilePath(portal),
        ),
      ).toBe(false);
      expect(permittedNavigation(portal, [permission]).at(-1)).toMatchObject({
        path: profilePath(portal),
        label: "Profile",
        sectionStart: true,
      });
    },
  );
  it("prefers an authorized requested portal and falls back deterministically", () => {
    const current = context(["TECHNOLOGY", "ACADEMIC"]);
    expect(authorizedPrimaryPortal(current, "TECHNOLOGY")).toBe("TECHNOLOGY");
    expect(authorizedPrimaryPortal(current, "STUDENT")).toBe("ACADEMIC");
    expect(authorizedPrimaryPortal(current)).toBe("ACADEMIC");
    expect(authorizedPrimaryPortal(context(["ACADEMIC", "TECHNOLOGY"]))).toBe(
      "ACADEMIC",
    );
  });
  it("never adopts a requested portal or membership without portal-view permission", () => {
    expect(authorizedPrimaryPortal(context([], true), "STUDENT")).toBeNull();
    expect(
      authorizedPrimaryPortal(context(["TECHNOLOGY"], false), "TECHNOLOGY"),
    ).toBeNull();
  });
});
