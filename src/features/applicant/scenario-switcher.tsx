"use client";

import { FieldLabel, Select } from "@/components/ui/input";
import { useId } from "react";
import { scenarios, type ScenarioKey } from "./demo-data";
import { useApplicantDemo } from "./demo-context";

const scenarioGroups: { label: string; keys: ScenarioKey[] }[] = [
  { label: "Application", keys: ["draft", "submitted", "documents"] },
  {
    label: "DCAT",
    keys: ["eligible", "scheduled", "awaiting", "notQualified"],
  },
  { label: "Enrollment", keys: ["passed", "coe", "cor"] },
];

export function ApplicantScenarioSwitcher() {
  const { scenario, setScenario } = useApplicantDemo();
  const id = useId();

  return (
    <section
      className="applicant-navigation-tools"
      aria-labelledby={`${id}-label`}
    >
      <FieldLabel id={`${id}-label`} htmlFor={id}>
        Demo scenario
      </FieldLabel>
      <Select
        id={id}
        value={scenario}
        onChange={(event) => setScenario(event.target.value as ScenarioKey)}
      >
        {scenarioGroups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.keys.map((key) => (
              <option key={key} value={key}>
                {scenarios[key].label}
              </option>
            ))}
          </optgroup>
        ))}
      </Select>
      <p>Changes the sample journey only. No school records change.</p>
    </section>
  );
}
