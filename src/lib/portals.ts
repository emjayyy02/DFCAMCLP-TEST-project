export const portalCodes = [
  "APPLICANT",
  "STUDENT",
  "ACADEMIC",
  "RECORDS",
  "OPERATIONS",
  "TECHNOLOGY",
] as const;

export type PortalCode = (typeof portalCodes)[number];

export const portalDetails: Record<
  PortalCode,
  { label: string; slug: string }
> = {
  APPLICANT: { label: "Applicant", slug: "applicant" },
  STUDENT: { label: "Student", slug: "student" },
  ACADEMIC: { label: "Academic", slug: "academic" },
  RECORDS: { label: "Admissions & Records", slug: "records" },
  OPERATIONS: { label: "Operations", slug: "operations" },
  TECHNOLOGY: { label: "Technology", slug: "technology" },
};

export function isPortalCode(value: string): value is PortalCode {
  return portalCodes.includes(value as PortalCode);
}

export function portalCodeFromSlug(slug: string): PortalCode | null {
  return portalCodes.find((code) => portalDetails[code].slug === slug) ?? null;
}

export function portalPath(portal: PortalCode) {
  return `/${portalDetails[portal].slug}`;
}
