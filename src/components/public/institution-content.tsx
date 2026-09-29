import { campusProgramGroups } from "../../lib/institution-programs";

// Public presentation of DFCAMCLP.md's canonical program registry. This
// overview needs no database connection or admissions workflow.
export function CampusPrograms({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="campus-columns">
      {campusProgramGroups.map((campus) => (
        <section className="campus-group" key={campus.name}>
          <div className="campus-heading">
            <h3>{campus.name}</h3>
          </div>
          <table
            className="program-table"
            aria-label={`${campus.name} degree programs`}
          >
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Degree program</th>
              </tr>
            </thead>
            <tbody>
              {campus.programs.map((program) => (
                <tr key={program.code}>
                  <th scope="row" className="program-code">
                    {program.code}
                  </th>
                  <td>
                    <span>{program.name}</span>
                    {detailed && program.majors.length > 0 ? (
                      <ul className="major-list" aria-label="BSBA majors">
                        {program.majors.map((major) => (
                          <li key={major}>{major}</li>
                        ))}
                      </ul>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}

const historyEvents = [
  {
    year: "1998",
    title: "College established",
    description:
      "DFCAMCLP was established through the Las Piñas city initiative as a local public college.",
  },
  {
    year: "2017",
    title: "Accountancy achievement",
    description:
      "A DFCAMCLP BS Accountancy graduate placed No. 3 in the May 2017 Certified Public Accountant board examination.",
  },
  {
    year: "2019",
    title: "Information Systems introduced",
    description:
      "Bachelor of Science in Information Systems opened under the Institute of Technology for AY 2019–2020, following permit approval.",
  },
  {
    year: "Today",
    title: "Two-campus academic community",
    description:
      "Current project model: Main Campus and IIT Campus, with Accountancy, Business Administration, Information Systems, and Computer Engineering.",
  },
] as const;

export function HistoryTimeline() {
  return (
    <ol className="history-timeline">
      {historyEvents.map((event) => (
        <li key={event.year}>
          <p className="history-year">{event.year}</p>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
        </li>
      ))}
    </ol>
  );
}

const steps = [
  ["Application", "Start an application journey."],
  [
    "Physical documents & verification",
    "Submit documents in person for staff review.",
  ],
  ["DCAT", "Take the college admission examination."],
  ["Results", "Review the released admission outcome."],
  ["Enrollment", "Continue to enrollment after a passing result."],
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
