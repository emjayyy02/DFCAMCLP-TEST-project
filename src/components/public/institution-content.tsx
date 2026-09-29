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
    summary: "Established through city initiative and funding.",
    detail:
      "Contemporary reporting describes the college as established through the initiative and funding of the Las Piñas City government.",
  },
  {
    year: "2017",
    title: "A graduating class",
    summary:
      "City coverage recorded the DFCAMCLP Batch 2017 graduation and its city-funded college context.",
    detail:
      "The City of Las Piñas documented the Batch 2017 graduation as part of its scholarship and public-college story.",
  },
  {
    year: "2019",
    title: "Information Systems added",
    summary:
      "The Information Systems degree opened at the Institute of Technology for academic year 2019–20 after a city permit application was approved.",
    detail:
      "The City reported the Bachelor of Science in Information Systems opening at DFCAMCLP-IT for academic year 2019–20 after CHED approved the city's application for a permit.",
  },
] as const;

export function HistoryTimeline({ detailed = false }: { detailed?: boolean }) {
  const events = detailed
    ? historyEvents
    : historyEvents.filter((event) => event.year !== "2017");

  return (
    <ol className="history-timeline">
      {events.map((event) => (
        <li key={event.year}>
          <p className="history-year">{event.year}</p>
          <h3>{event.title}</h3>
          <p>{detailed ? event.detail : event.summary}</p>
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
