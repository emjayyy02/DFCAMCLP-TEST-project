// Public presentation of PRODUCT.md and Phase 1 institution facts.
// This overview needs no database connection or admissions workflow.
const campuses = [
  {
    name: "Main Campus",
    location: "Talon III",
    programs: [
      { code: "BSA", name: "Bachelor of Science in Accountancy", majors: [] },
      {
        code: "BSBA",
        name: "Bachelor of Science in Business Administration",
        majors: [
          "Financial Management",
          "Marketing Management",
          "Human Resource Management",
        ],
      },
    ],
  },
  {
    name: "IIT Campus",
    location: "Information systems & engineering",
    programs: [
      {
        code: "BSIS",
        name: "Bachelor of Science in Information Systems",
        majors: [],
      },
      { code: "BSCpE", name: "Computer Engineering", majors: [] },
    ],
  },
];
export function CampusPrograms({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="campus-columns">
      {campuses.map((campus) => (
        <section className="campus-group" key={campus.name}>
          <div className="campus-heading">
            <h3>{campus.name}</h3>
            <p>{campus.location}</p>
          </div>
          <ul className="program-list">
            {campus.programs.map((program) => (
              <li key={program.code}>
                <span className="program-code">{program.code}</span>
                <div>
                  <p>{program.name}</p>
                  {detailed && program.majors.length > 0 && (
                    <ul className="major-list" aria-label="BSBA majors">
                      {program.majors.map((major) => (
                        <li key={major}>{major}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
const steps = [
  ["Application", "Begin the admissions journey."],
  ["Document submission", "Submit physical documents for verification."],
  ["DCAT", "Take the admission examination."],
  ["Results", "Check the admission outcome."],
  ["Enrollment", "Complete enrollment after admission."],
];
export function AdmissionsJourney({
  detailed = false,
}: {
  detailed?: boolean;
}) {
  return (
    <ol className={`admissions-journey${detailed ? " journey-detailed" : ""}`}>
      {steps.map(([title, description], index) => (
        <li key={title}>
          <span className="journey-number" aria-hidden="true">
            {index + 1}
          </span>
          <div>
            <h3>{title}</h3>
            {detailed && <p>{description}</p>}
            {!detailed && title === "DCAT" && <p>Admission examination</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
