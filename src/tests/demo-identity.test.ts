import { describe, expect, it } from "vitest";
import { developmentAuthAccountSeed } from "../server/db/seed/data";
import { membershipSeed } from "../server/access-control/seed-data";
import { studentDemoData } from "../features/student/demo-data";
import { applicantIdentity } from "../features/applicant/demo-data";
import { academicDemoData } from "../features/academic/demo-data";
import { initialStudents } from "../features/records/demo-data";

describe("Demo identity integrity", () => {
  it("uses exactly the nine approved human demo identities", () => {
    expect(
      developmentAuthAccountSeed.map(({ name, email }) => [name, email]),
    ).toEqual([
      ["John Paul Reyes", "johnpaul.reyes@example.invalid"],
      ["Juan Dela Cruz", "juan.delacruz@example.invalid"],
      ["Maria Santos", "maria.santos@example.invalid"],
      ["Jose Garcia", "jose.garcia@example.invalid"],
      ["Mark Ramos", "mark.ramos@example.invalid"],
      ["Angelo Cruz", "angelo.cruz@example.invalid"],
      ["Angelica Bautista", "angelica.bautista@example.invalid"],
      ["Mary Grace Mendoza", "marygrace.mendoza@example.invalid"],
      ["Michael Castro", "michael.castro@example.invalid"],
    ]);
  });
  it.each(developmentAuthAccountSeed)(
    "keeps $email fictional with unique identity and memberships",
    (account) => {
      expect(account.email).toMatch(/@example\.invalid$/);
      expect(
        developmentAuthAccountSeed.filter(
          (candidate) => candidate.personId === account.personId,
        ),
      ).toHaveLength(1);
      expect(
        membershipSeed.some((membership) => membership.email === account.email),
      ).toBe(true);
      expect(account.name).not.toMatch(/marvin|silverio/i);
    },
  );
  it("joins the same Student across domain fixtures by its stable ID", () => {
    const account = developmentAuthAccountSeed[0];
    expect(studentDemoData.identity).toMatchObject({
      fullName: account.name,
      email: account.email,
    });
    expect(
      initialStudents.find(
        (student) => student.id === studentDemoData.identity.studentId,
      ),
    ).toMatchObject({ name: account.name, email: account.email });
    expect(
      academicDemoData.students.find(
        (student) => student.studentId === studentDemoData.identity.studentId,
      )?.name,
    ).toBe(account.name);
  });
  it("derives Applicant and Academic names from the account seed", () => {
    expect(`${applicantIdentity.firstName} ${applicantIdentity.lastName}`).toBe(
      developmentAuthAccountSeed[1].name,
    );
    expect(applicantIdentity.email).toBe(developmentAuthAccountSeed[1].email);
    expect(academicDemoData.identities.faculty.name).toBe(
      developmentAuthAccountSeed[2].name,
    );
    expect(academicDemoData.identities.coordinator.name).toBe(
      developmentAuthAccountSeed[6].name,
    );
  });
});
