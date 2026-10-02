"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContextHeader } from "@/components/ui/context-header";
import { Avatar } from "@/components/ui/identity";
import { Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/portal/page-header";
import { DemoNotice as SharedDemoNotice } from "@/components/ui/demo-notice";
import { EmptyState as SharedEmptyState } from "@/components/ui/states";
import { campusOptions } from "../applicant/demo-data";
import { useOperationsDemo } from "./demo-context";
import {
  countOpenFacilityTickets,
  countOpenStudentServiceRequests,
  filterEmployees,
  filterFacilityTickets,
  filterStudentServiceRequests,
  facilityCategories,
  facilityStatuses,
  operationsIdentity,
  operationsInstitutionRegistry,
  operationsTerm,
  sortEmployeesByName,
  sortFacilityTicketsForQueue,
  studentServiceCategories,
  studentServiceStatuses,
  type EmployeeDirectoryEntry,
  type FacilityStatus,
  type FacilityTicket,
  type OperationsActivity,
  type StudentServiceRequest,
  type StudentServiceStatus,
} from "./demo-data";
import "./operations.css";

type OperationsPageProps = {
  section: string;
  title: string;
  description: string;
  isMaintenanceStaff: boolean;
  requestId?: string;
  employeeId?: string;
  ticketId?: string;
  facilityView?: string;
};

type StatusLabelProps = { children: React.ReactNode };

function StatusLabel({ children }: StatusLabelProps) {
  const tone =
    children === "High"
      ? "destructive"
      : children === "Closed"
        ? "neutral"
        : children === "Resolved"
          ? "success"
          : children === "New" || children === "Open"
            ? "warning"
            : children === "In Review" || children === "In Progress"
              ? "info"
              : "neutral";
  return <Badge tone={tone}>{children}</Badge>;
}

function DemoNotice({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return <SharedDemoNotice detail={children} label={label} />;
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <SharedEmptyState title={title} description={detail} />;
}

function MissingDetail({
  title,
  detail,
  href,
  backLabel,
}: {
  title: string;
  detail: string;
  href: string;
  backLabel: string;
}) {
  return (
    <div className="operations-stack">
      <Link className="operations-back-link" href={href}>
        {backLabel}
      </Link>
      <EmptyState title={title} detail={detail} />
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="operations-detail-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function RecentActivity({ items }: { items: OperationsActivity[] }) {
  return (
    <section className="operations-panel" aria-labelledby="activity-title">
      <div className="operations-panel-heading">
        <div>
          <h2 id="activity-title">Recent demo activity</h2>
          <p>Sample changes made in this browser session.</p>
        </div>
      </div>
      {items.length ? (
        <ul className="operations-activity-list">
          {items.map((item) => (
            <li key={item.id}>
              <time>{item.date}</time>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No recent activity"
          detail="Demo updates will appear here during this browser session."
        />
      )}
    </section>
  );
}

function QueueCountLink({
  href,
  label,
  detail,
  count,
}: {
  href: string;
  label: string;
  detail: string;
  count: number;
}) {
  return (
    <Link className="operations-queue-link" href={href}>
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <span className="operations-queue-count" aria-label={`${count} items`}>
        {count}
      </span>
    </Link>
  );
}

function OperationsDashboard({
  isMaintenanceStaff,
}: {
  isMaintenanceStaff: boolean;
}) {
  const { requests, tickets, employees, activity } = useOperationsDemo();
  const openRequests = countOpenStudentServiceRequests(requests);
  const openTickets = countOpenFacilityTickets(tickets);
  const highPriority = tickets.filter(
    (ticket) => ticket.priority === "High",
  ).length;
  const myTickets = tickets.filter(
    (ticket) => ticket.assigneeId === operationsIdentity.maintenanceStaffId,
  ).length;
  const unassigned = tickets.filter((ticket) => !ticket.assigneeId).length;

  if (isMaintenanceStaff) {
    const activeTickets = sortFacilityTicketsForQueue(
      tickets.filter(
        (ticket) => ticket.status === "Open" || ticket.status === "In Progress",
      ),
    ).slice(0, 3);
    return (
      <div className="operations-stack">
        <section
          className="operations-panel"
          aria-labelledby="maintenance-work-title"
        >
          <div className="operations-panel-heading">
            <div>
              <h2 id="maintenance-work-title">Facilities work</h2>
              <p>
                Open the sample queue to review a ticket and update its demo
                state.
              </p>
            </div>
          </div>
          <div className="operations-quick-counts">
            <QueueCountLink
              href="/operations/facilities?view=mine"
              label="My tickets"
              detail={`Assigned to ${operationsIdentity.maintenanceStaffName}`}
              count={myTickets}
            />
            <QueueCountLink
              href="/operations/facilities?view=high"
              label="High priority"
              detail="Tickets marked High priority"
              count={highPriority}
            />
            <QueueCountLink
              href="/operations/facilities?view=unassigned"
              label="Unassigned"
              detail="Tickets without an assignee"
              count={unassigned}
            />
          </div>
          <div className="operations-ticket-preview">
            <h3>Active tickets</h3>
            {activeTickets.length ? (
              <ul className="operations-activity-list">
                {activeTickets.map((ticket) => (
                  <li key={ticket.id}>
                    <span className="operations-ticket-preview-id">
                      {ticket.id}
                    </span>
                    <Link href={`/operations/facilities?ticket=${ticket.id}`}>
                      {ticket.campus} · {ticket.area} — {ticket.issue}
                    </Link>
                    <span className="operations-ticket-preview-meta">
                      <span>
                        Priority: <StatusLabel>{ticket.priority}</StatusLabel>
                      </span>
                      <span>
                        Status: <StatusLabel>{ticket.status}</StatusLabel>
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No active tickets"
                detail="The sample facilities queue has no open or in-progress work."
              />
            )}
            <p className="operations-footnote">
              {openTickets} unresolved sample tickets · no response-time policy
              is represented.
            </p>
          </div>
        </section>
        <RecentActivity
          items={activity.filter((item) =>
            item.href.startsWith("/operations/facilities"),
          )}
        />
      </div>
    );
  }

  return (
    <div className="operations-stack">
      <section
        className="operations-panel"
        aria-labelledby="support-work-title"
      >
        <div className="operations-panel-heading">
          <div>
            <h2 id="support-work-title">Support work</h2>
            <p>Counts are derived from the fictional queues below.</p>
          </div>
        </div>
        <div className="operations-queue-list">
          <QueueCountLink
            href="/operations/student-services"
            label="Student Services"
            detail="New and in-review sample requests"
            count={openRequests}
          />
          <QueueCountLink
            href="/operations/facilities"
            label="Facilities"
            detail="Open and in-progress sample tickets"
            count={openTickets}
          />
        </div>
      </section>
      <div className="operations-dashboard-grid">
        <section
          className="operations-panel"
          aria-labelledby="employee-summary-title"
        >
          <div className="operations-panel-heading">
            <div>
              <h2 id="employee-summary-title">Employee directory</h2>
              <p>{employees.length} fictional entries · demo groupings only.</p>
            </div>
            <Link className="operations-text-link" href="/operations/employees">
              Find an employee
            </Link>
          </div>
          <p className="operations-reference-line">
            Search by name, employee ID, campus, or functional area.
          </p>
        </section>
        <section
          className="operations-panel"
          aria-labelledby="reference-summary-title"
        >
          <div className="operations-panel-heading">
            <div>
              <h2 id="reference-summary-title">Institutional references</h2>
              <p>
                {operationsInstitutionRegistry.length} campuses ·{" "}
                {operationsInstitutionRegistry.reduce(
                  (count, campus) => count + campus.programs.length,
                  0,
                )}{" "}
                degree programs
              </p>
            </div>
            <Link
              className="operations-text-link"
              href="/operations/administration"
            >
              View references
            </Link>
          </div>
          <p className="operations-reference-line">
            Current demo term: {operationsTerm.academicYear} ·{" "}
            {operationsTerm.semester}.
          </p>
        </section>
      </div>
      <RecentActivity items={activity} />
    </div>
  );
}

function FilterField({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="operations-filter-field" htmlFor={id}>
      <span>{label}</span>
      <Select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </Select>
    </label>
  );
}

function RequestDetail({ request }: { request: StudentServiceRequest }) {
  const { updateRequestStatus } = useOperationsDemo();
  const [status, setStatus] = useState<StudentServiceStatus>(request.status);
  const [outcomeNote, setOutcomeNote] = useState("");

  function submitStatus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateRequestStatus(request.id, status, outcomeNote);
  }

  return (
    <div className="operations-stack">
      <ContextHeader
        parent="Student Services"
        parentHref="/operations/student-services"
        title={request.studentName}
        metadata={
          <div className="operations-context-metadata">
            <span>Request {request.id}</span>
            <span>Student ID: {request.studentId}</span>
            <StatusLabel>{request.status}</StatusLabel>
          </div>
        }
        description={`${request.category} · ${request.campus} · Received ${request.createdOn}`}
        backHref="/operations/student-services"
        backLabel="Back to Student Services"
      />
      <div className="operations-detail-grid-layout">
        <Card aria-label={`Request details for ${request.studentName}`}>
          <div className="operations-panel-heading">
            <div>
              <h2>Request update</h2>
            </div>
          </div>
          <div className="operations-message-block">
            <h3>Student message</h3>
            <p>{request.message}</p>
          </div>
          <form className="operations-action-form" onSubmit={submitStatus}>
            <label htmlFor="request-status">
              <span>Demo status</span>
              <Select
                id="request-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as StudentServiceStatus)
                }
              >
                {studentServiceStatuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </label>
            {(status === "Resolved" || status === "Closed") &&
            status !== request.status ? (
              <label htmlFor="request-outcome-note">
                <span>
                  {status === "Resolved" ? "Resolution note" : "Closure note"}
                </span>
                <Textarea
                  id="request-outcome-note"
                  value={outcomeNote}
                  onChange={(event) => setOutcomeNote(event.target.value)}
                  required
                  rows={3}
                  maxLength={240}
                  placeholder="Briefly describe the guidance or next step"
                />
              </label>
            ) : null}
            <Button type="submit" disabled={status === request.status}>
              Save demo status
            </Button>
            <p className="operations-footnote">
              This changes only the sample view. It does not contact the student
              or update a school record.
            </p>
          </form>
        </Card>
        <section
          className="operations-panel"
          aria-labelledby="request-history-title"
        >
          <div className="operations-panel-heading">
            <div>
              <h2 id="request-history-title">Activity</h2>
              <p>Sample status history for this request.</p>
            </div>
          </div>
          <HistoryList history={request.history} />
          <p className="operations-footnote">
            Academic records, admissions, enrollment, and COE/COR requests
            belong to Admissions &amp; Records.
          </p>
        </section>
      </div>
    </div>
  );
}

function StudentServices({ requestId }: { requestId?: string }) {
  const { requests } = useOperationsDemo();
  const request = requestId
    ? requests.find((item) => item.id === requestId)
    : undefined;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [campus, setCampus] = useState("All");
  const [category, setCategory] = useState("All");
  const visibleRequests = useMemo(
    () =>
      filterStudentServiceRequests(requests, {
        search,
        status,
        campus,
        category,
      }),
    [requests, search, status, campus, category],
  );

  if (requestId) {
    if (!request) {
      return (
        <MissingDetail
          title="Request not found"
          detail="Return to the queue to choose an available sample request."
          href="/operations/student-services"
          backLabel="Back to Student Services"
        />
      );
    }
    return <RequestDetail key={request.id} request={request} />;
  }

  return (
    <div className="operations-stack">
      <DemoNotice label="Service model">
        Sample service categories and statuses are project assumptions. No SLA
        or official service catalog is represented.
      </DemoNotice>
      <section
        className="operations-panel"
        aria-labelledby="requests-queue-title"
      >
        <div className="operations-panel-heading">
          <div>
            <h2 id="requests-queue-title">Student service requests</h2>
            <p>Review a request and make a browser-only demo status change.</p>
          </div>
          <span
            className="operations-result-count"
            aria-live="polite"
            aria-atomic="true"
          >
            {visibleRequests.length} of {requests.length} requests
          </span>
        </div>
        <div className="operations-filters operations-request-filters">
          <label className="operations-filter-field" htmlFor="request-search">
            <span>Search requests</span>
            <Input
              id="request-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, ID, or request"
            />
          </label>
          <FilterField
            id="request-status-filter"
            label="Status"
            value={status}
            onChange={setStatus}
          >
            <option>All</option>
            {studentServiceStatuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </FilterField>
          <FilterField
            id="request-campus-filter"
            label="Campus"
            value={campus}
            onChange={setCampus}
          >
            <option>All</option>
            {campusOptions.map((item) => (
              <option key={item.code}>{item.label}</option>
            ))}
          </FilterField>
          <FilterField
            id="request-category-filter"
            label="Category"
            value={category}
            onChange={setCategory}
          >
            <option>All</option>
            {studentServiceCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </FilterField>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setSearch("");
              setStatus("All");
              setCampus("All");
              setCategory("All");
            }}
          >
            Clear filters
          </Button>
        </div>
        {visibleRequests.length ? (
          <>
            <div className="operations-record-cards">
              <ul>
                {visibleRequests.map((item) => (
                  <li key={item.id}>
                    <Link
                      className="operations-mobile-record"
                      href={`/operations/student-services?request=${item.id}`}
                    >
                      <span className="operations-mobile-record-heading">
                        <span>
                          <strong>{item.studentName}</strong>
                          <small>{item.id}</small>
                        </span>
                        <StatusLabel>{item.status}</StatusLabel>
                      </span>
                      <span>{item.category}</span>
                      <span className="operations-muted-line">
                        {item.campus} · {item.createdOn}
                      </span>
                      <span className="operations-mobile-open">
                        Open request
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="operations-table-wrap">
              <table
                className="data-table operations-table"
                aria-label="Student service requests"
              >
                <thead>
                  <tr>
                    <th scope="col">Request / student</th>
                    <th scope="col">Category</th>
                    <th scope="col">Campus</th>
                    <th scope="col">Received</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRequests.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Link
                          className="operations-table-link"
                          href={`/operations/student-services?request=${item.id}`}
                        >
                          {item.studentName}
                        </Link>
                        <span className="operations-table-secondary">
                          {item.id} · {item.studentId}
                        </span>
                      </td>
                      <td>{item.category}</td>
                      <td>{item.campus}</td>
                      <td>{item.createdOn}</td>
                      <td>
                        <StatusLabel>{item.status}</StatusLabel>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <EmptyState
            title={
              requests.length
                ? "No student-service requests match"
                : "No student-service requests"
            }
            detail={
              requests.length
                ? "Try another search or filter."
                : "Fictional sample requests will appear here."
            }
          />
        )}
      </section>
      <p className="operations-footnote">
        Admissions, DCAT, enrollment, student records, and official documents
        stay with Admissions &amp; Records.
      </p>
    </div>
  );
}

function EmployeeDetail({ employee }: { employee: EmployeeDirectoryEntry }) {
  return (
    <div className="operations-stack">
      <ContextHeader
        parent="Employees"
        parentHref="/operations/employees"
        title={employee.name}
        metadata={
          <div className="operations-context-metadata">
            <span>Employee ID: {employee.id}</span>
          </div>
        }
        description="Fictional staff directory entry. Functional areas are provisional demo groupings."
        backHref="/operations/employees"
        backLabel="Back to Employees"
      />
      <Card aria-label={`Directory details for ${employee.name}`}>
        <div className="operations-panel-heading">
          <div>
            <h2>Directory details</h2>
          </div>
        </div>
        <dl className="operations-detail-list">
          <DetailRow label="Position">{employee.position}</DetailRow>
          <DetailRow label="Campus">{employee.campus}</DetailRow>
          <DetailRow label="Functional area · demo grouping">
            {employee.functionalArea}
          </DetailRow>
          <DetailRow label="Directory status">
            Listed in this demo directory
          </DetailRow>
        </dl>
        <p className="operations-footnote">
          This fictional listing does not confirm an official department,
          employment status, or account access.
        </p>
      </Card>
    </div>
  );
}

function Employees({ employeeId }: { employeeId?: string }) {
  const { employees } = useOperationsDemo();
  const employee = employeeId
    ? employees.find((item) => item.id === employeeId)
    : undefined;
  const [search, setSearch] = useState("");
  const [campus, setCampus] = useState("All");
  const [functionalArea, setFunctionalArea] = useState("All");
  const visibleEmployees = useMemo(
    () =>
      sortEmployeesByName(
        filterEmployees(employees, { search, campus, functionalArea }),
      ),
    [employees, search, campus, functionalArea],
  );

  if (employeeId) {
    if (!employee) {
      return (
        <MissingDetail
          title="Employee not found"
          detail="Return to the directory to choose an available fictional entry."
          href="/operations/employees"
          backLabel="Back to Employees"
        />
      );
    }
    return <EmployeeDetail employee={employee} />;
  }

  return (
    <div className="operations-stack">
      <DemoNotice label="Directory scope">
        Fictional employee entries use provisional functional groupings, not an
        official organization chart. No HR or account-access workflow is
        included.
      </DemoNotice>
      <section
        className="operations-panel"
        aria-labelledby="employee-directory-title"
      >
        <div className="operations-panel-heading">
          <div>
            <h2 id="employee-directory-title">Employee directory</h2>
            <p>Basic identity and work assignment for this demonstration.</p>
          </div>
          <span
            className="operations-result-count"
            aria-live="polite"
            aria-atomic="true"
          >
            {visibleEmployees.length} of {employees.length} entries
          </span>
        </div>
        <div className="operations-filters operations-employee-filters">
          <label className="operations-filter-field" htmlFor="employee-search">
            <span>Search employees</span>
            <Input
              id="employee-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, ID, campus, or area"
            />
          </label>
          <FilterField
            id="employee-campus-filter"
            label="Campus"
            value={campus}
            onChange={setCampus}
          >
            <option>All</option>
            {campusOptions.map((item) => (
              <option key={item.code}>{item.label}</option>
            ))}
          </FilterField>
          <FilterField
            id="employee-area-filter"
            label="Functional area"
            value={functionalArea}
            onChange={setFunctionalArea}
          >
            <option>All</option>
            <option>Student Services</option>
            <option>Facilities</option>
            <option>Administration</option>
            <option>Academic</option>
            <option>Technology</option>
          </FilterField>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setSearch("");
              setCampus("All");
              setFunctionalArea("All");
            }}
          >
            Clear filters
          </Button>
        </div>
        {visibleEmployees.length ? (
          <>
            <div className="operations-record-cards">
              <ul>
                {visibleEmployees.map((item) => (
                  <li key={item.id}>
                    <Link
                      className="operations-mobile-record"
                      href={`/operations/employees?employee=${item.id}`}
                    >
                      <span className="operations-mobile-record-heading">
                        <span className="operations-mobile-record-identity">
                          <Avatar name={item.name} size="small" />
                          <span>
                            <strong>{item.name}</strong>
                            <small>{item.id}</small>
                          </span>
                        </span>
                        <StatusLabel>{item.listingStatus} · demo</StatusLabel>
                      </span>
                      <span>{item.position}</span>
                      <span className="operations-muted-line">
                        {item.functionalArea} · {item.campus}
                      </span>
                      <span className="operations-mobile-open">
                        View profile
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="operations-table-wrap">
              <table
                className="data-table operations-table"
                aria-label="Fictional employee directory"
              >
                <thead>
                  <tr>
                    <th scope="col">Employee</th>
                    <th scope="col">Functional area</th>
                    <th scope="col">Campus</th>
                    <th scope="col">Position</th>
                    <th scope="col">Directory status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleEmployees.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Link
                          className="operations-table-link"
                          href={`/operations/employees?employee=${item.id}`}
                        >
                          {item.name}
                        </Link>
                        <span className="operations-table-secondary">
                          {item.id}
                        </span>
                      </td>
                      <td>{item.functionalArea}</td>
                      <td>{item.campus}</td>
                      <td>{item.position}</td>
                      <td>
                        <StatusLabel>{item.listingStatus} · demo</StatusLabel>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <EmptyState
            title={
              employees.length
                ? "No employees match"
                : "No employees in the directory"
            }
            detail={
              employees.length
                ? "Try another search or filter."
                : "Fictional directory entries will appear here."
            }
          />
        )}
      </section>
    </div>
  );
}

type TicketView = "all" | "mine" | "open" | "progress" | "high" | "unassigned";
const ticketViews: { value: TicketView; label: string }[] = [
  { value: "all", label: "All tickets" },
  { value: "mine", label: "My tickets" },
  { value: "open", label: "Open" },
  { value: "progress", label: "In Progress" },
  { value: "high", label: "High priority" },
  { value: "unassigned", label: "Unassigned" },
];

function HistoryList({
  history,
}: {
  history: { date: string; label: string }[];
}) {
  return (
    <ol className="operations-history-list">
      {history.map((item, index) => (
        <li key={`${item.date}-${index}`}>
          <time>{item.date}</time>
          <span>{item.label}</span>
        </li>
      ))}
    </ol>
  );
}

function TicketDetail({
  ticket,
  view,
}: {
  ticket: FacilityTicket;
  view: TicketView;
}) {
  const { employees, updateTicketStatus, assignTicket } = useOperationsDemo();
  const facilitiesStaff = employees.filter(
    (employee) => employee.functionalArea === "Facilities",
  );
  const [status, setStatus] = useState<FacilityStatus>(ticket.status);
  const [completionNote, setCompletionNote] = useState("");
  const [assigneeId, setAssigneeId] = useState(ticket.assigneeId ?? "");

  function submitStatus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateTicketStatus(ticket.id, status, completionNote);
  }

  function submitAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    assignTicket(ticket.id, assigneeId || null);
  }

  const assignee = employees.find(
    (employee) => employee.id === ticket.assigneeId,
  );
  const backHref =
    view === "all"
      ? "/operations/facilities"
      : `/operations/facilities?view=${view}`;

  return (
    <div className="operations-stack">
      <ContextHeader
        parent="Facilities"
        parentHref="/operations/facilities"
        title={ticket.issue}
        metadata={
          <div className="operations-context-metadata">
            <span>Ticket {ticket.id}</span>
            <StatusLabel>{ticket.status}</StatusLabel>
          </div>
        }
        backHref={backHref}
        backLabel="Back to Facilities"
      />
      <div className="operations-detail-grid-layout">
        <Card aria-label={`Ticket details for ${ticket.id}`}>
          <div className="operations-panel-heading">
            <div>
              <h2>Ticket details</h2>
            </div>
          </div>
          <dl className="operations-detail-list">
            <DetailRow label="Location">
              {ticket.campus} · {ticket.area}
            </DetailRow>
            <DetailRow label="Category">{ticket.category}</DetailRow>
            <DetailRow label="Priority">
              <StatusLabel>{ticket.priority}</StatusLabel>
            </DetailRow>
            <DetailRow label="Reported">{ticket.reportedOn}</DetailRow>
            <DetailRow label="Assigned staff">
              {assignee?.name ?? "Unassigned"}
            </DetailRow>
          </dl>
          <div className="operations-detail-actions">
            <form className="operations-action-form" onSubmit={submitStatus}>
              <label htmlFor="ticket-status">
                <span>Demo status</span>
                <Select
                  id="ticket-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as FacilityStatus)
                  }
                >
                  {facilityStatuses.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </Select>
              </label>
              {(status === "Resolved" || status === "Closed") &&
              status !== ticket.status ? (
                <label htmlFor="ticket-completion-note">
                  <span>
                    {status === "Resolved" ? "Completion note" : "Closure note"}
                  </span>
                  <Textarea
                    id="ticket-completion-note"
                    value={completionNote}
                    onChange={(event) => setCompletionNote(event.target.value)}
                    required
                    rows={3}
                    maxLength={240}
                    placeholder="Briefly describe the sample work completed"
                  />
                </label>
              ) : null}
              <Button type="submit" disabled={status === ticket.status}>
                Save demo status
              </Button>
              <p className="operations-footnote">
                Status changes stay in this browser session. No work order is
                dispatched.
              </p>
            </form>
            <form
              className="operations-action-form"
              onSubmit={submitAssignment}
            >
              <label htmlFor="ticket-assignee">
                <span>Assigned maintenance staff</span>
                <Select
                  id="ticket-assignee"
                  value={assigneeId}
                  onChange={(event) => setAssigneeId(event.target.value)}
                >
                  <option value="">Unassigned</option>
                  {facilitiesStaff.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </Select>
              </label>
              <Button
                type="submit"
                variant="outline"
                disabled={assigneeId === (ticket.assigneeId ?? "")}
              >
                Save demo assignment
              </Button>
            </form>
          </div>
        </Card>
        <section
          className="operations-panel"
          aria-labelledby="ticket-history-title"
        >
          <div className="operations-panel-heading">
            <div>
              <h2 id="ticket-history-title">Activity</h2>
              <p>Sample ticket history for this browser session.</p>
            </div>
          </div>
          <HistoryList history={ticket.history} />
          <p className="operations-footnote">
            Demo ticket labels; no response-time or emergency policy is defined.
          </p>
        </section>
      </div>
    </div>
  );
}

function Facilities({
  ticketId,
  isMaintenanceStaff,
  facilityView,
}: {
  ticketId?: string;
  isMaintenanceStaff: boolean;
  facilityView?: string;
}) {
  const router = useRouter();
  const { tickets } = useOperationsDemo();
  const ticket = ticketId
    ? tickets.find((item) => item.id === ticketId)
    : undefined;
  const initialView = ticketViews.some((item) => item.value === facilityView)
    ? (facilityView as TicketView)
    : isMaintenanceStaff
      ? "mine"
      : "all";
  const [view, setView] = useState<TicketView>(initialView);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [campus, setCampus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [category, setCategory] = useState("All");

  const visibleTickets = useMemo(() => {
    const filters: Parameters<typeof filterFacilityTickets>[1] = {
      search,
      status,
      campus,
      priority,
      category,
    };
    if (view === "mine")
      filters.assigneeId = operationsIdentity.maintenanceStaffId;
    if (view === "open") filters.status = "Open";
    if (view === "progress") filters.status = "In Progress";
    if (view === "high") filters.priority = "High";
    if (view === "unassigned") filters.assigneeId = null;
    return sortFacilityTicketsForQueue(filterFacilityTickets(tickets, filters));
  }, [tickets, search, status, campus, priority, category, view]);

  if (ticketId) {
    if (!ticket) {
      return (
        <MissingDetail
          title="Ticket not found"
          detail="Return to Facilities to choose an available sample ticket."
          href="/operations/facilities"
          backLabel="Back to Facilities"
        />
      );
    }
    return <TicketDetail key={ticket.id} ticket={ticket} view={view} />;
  }

  return (
    <div className="operations-stack">
      <DemoNotice label="Facilities model">
        Fictional locations and simple demo categories, priorities, and
        statuses. No inventory or response-time policy is represented.
      </DemoNotice>
      {isMaintenanceStaff ? (
        <div
          className="operations-filter-chips"
          role="group"
          aria-label="Quick ticket filters"
        >
          {ticketViews.map((item) => (
            <button
              key={item.value}
              type="button"
              className="operations-filter-chip"
              aria-pressed={view === item.value}
              onClick={() => {
                setView(item.value);
                setStatus(
                  item.value === "open"
                    ? "Open"
                    : item.value === "progress"
                      ? "In Progress"
                      : "All",
                );
                setPriority(item.value === "high" ? "High" : "All");
              }}
            >
              {item.label}
            </button>
          ))}
          <p className="operations-filter-help">
            “My tickets” uses the fictional identity{" "}
            {operationsIdentity.maintenanceStaffName}.
          </p>
        </div>
      ) : null}
      <section
        className="operations-panel"
        aria-labelledby="facilities-queue-title"
      >
        <div className="operations-panel-heading">
          <div>
            <h2 id="facilities-queue-title">Maintenance tickets</h2>
            <p>
              Review an issue, update its sample assignment, or change its demo
              status.
            </p>
          </div>
          <span
            className="operations-result-count"
            aria-live="polite"
            aria-atomic="true"
          >
            {visibleTickets.length} of {tickets.length} tickets
          </span>
        </div>
        <div className="operations-filters operations-facility-filters">
          <label className="operations-filter-field" htmlFor="ticket-search">
            <span>Search tickets</span>
            <Input
              id="ticket-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ticket, campus, location, or issue"
            />
          </label>
          <FilterField
            id="ticket-status-filter"
            label="Status"
            value={status}
            onChange={(value) => {
              setStatus(value);
              if (view === "open" || view === "progress") {
                setView(isMaintenanceStaff ? "mine" : "all");
              }
            }}
          >
            <option>All</option>
            {facilityStatuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </FilterField>
          <FilterField
            id="ticket-campus-filter"
            label="Campus"
            value={campus}
            onChange={setCampus}
          >
            <option>All</option>
            {campusOptions.map((item) => (
              <option key={item.code}>{item.label}</option>
            ))}
          </FilterField>
          <FilterField
            id="ticket-priority-filter"
            label="Priority"
            value={priority}
            onChange={(value) => {
              setPriority(value);
              if (view === "high") {
                setView(isMaintenanceStaff ? "mine" : "all");
              }
            }}
          >
            <option>All</option>
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
          </FilterField>
          <FilterField
            id="ticket-category-filter"
            label="Category"
            value={category}
            onChange={setCategory}
          >
            <option>All</option>
            {facilityCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </FilterField>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setSearch("");
              setStatus("All");
              setCampus("All");
              setPriority("All");
              setCategory("All");
              setView("all");
              router.replace("/operations/facilities", { scroll: false });
            }}
          >
            Clear filters
          </Button>
        </div>
        {visibleTickets.length ? (
          <>
            <div className="operations-record-cards">
              <ul>
                {visibleTickets.map((item) => {
                  return (
                    <li key={item.id}>
                      <Link
                        className="operations-mobile-record"
                        href={`/operations/facilities?ticket=${item.id}&view=${view}`}
                      >
                        <span className="operations-mobile-record-heading">
                          <span>
                            <strong>{item.id}</strong>
                            <small>
                              {item.campus} · {item.area}
                            </small>
                          </span>
                          <StatusLabel>{item.status}</StatusLabel>
                        </span>
                        <span>{item.issue}</span>
                        <span className="operations-status-line">
                          <StatusLabel>{item.priority}</StatusLabel>
                          <span>{item.category}</span>
                        </span>
                        <span className="operations-mobile-open">
                          Open ticket
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="operations-table-wrap">
              <table
                className="data-table operations-table"
                aria-label="Facilities maintenance tickets"
              >
                <thead>
                  <tr>
                    <th scope="col">Ticket / location</th>
                    <th scope="col">Issue</th>
                    <th scope="col">Category</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTickets.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Link
                          className="operations-table-link"
                          href={`/operations/facilities?ticket=${item.id}&view=${view}`}
                        >
                          {item.id}
                        </Link>
                        <span className="operations-table-secondary">
                          {item.campus} · {item.area}
                        </span>
                      </td>
                      <td>{item.issue}</td>
                      <td>{item.category}</td>
                      <td>
                        <StatusLabel>{item.priority}</StatusLabel>
                      </td>
                      <td>
                        <StatusLabel>{item.status}</StatusLabel>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <EmptyState
            title={
              tickets.length
                ? "No maintenance tickets match"
                : "No maintenance tickets"
            }
            detail={
              tickets.length
                ? "Try another search or filter."
                : "Fictional sample tickets will appear here."
            }
          />
        )}
      </section>
    </div>
  );
}

function Administration() {
  const degreeProgramCount = operationsInstitutionRegistry.reduce(
    (count, campus) => count + campus.programs.length,
    0,
  );
  const majorCount = operationsInstitutionRegistry.reduce(
    (count, campus) =>
      count +
      campus.programs.reduce((sum, program) => sum + program.majors.length, 0),
    0,
  );
  return (
    <div className="operations-stack">
      <DemoNotice label="Reference scope">
        Reference information is read-only demo context. Academic-year and
        semester values are not official live settings.
      </DemoNotice>
      <section
        className="operations-panel"
        aria-labelledby="term-context-title"
      >
        <div className="operations-panel-heading">
          <div>
            <h2 id="term-context-title">Current academic term</h2>
            <p>Displayed as application context for this concept.</p>
          </div>
          <StatusLabel>V1 ASSUMPTION</StatusLabel>
        </div>
        <p className="operations-term-line">
          {operationsTerm.academicYear} · {operationsTerm.semester}
        </p>
      </section>
      <section
        className="operations-panel"
        aria-labelledby="campus-registry-title"
      >
        <div className="operations-panel-heading">
          <div>
            <h2 id="campus-registry-title">Campus and program reference</h2>
            <p>
              {operationsInstitutionRegistry.length} campuses ·{" "}
              {degreeProgramCount} degree programs · {majorCount} BSBA majors
            </p>
          </div>
        </div>
        <div className="operations-campus-grid">
          {operationsInstitutionRegistry.map((campus) => (
            <section
              key={campus.code}
              aria-labelledby={`campus-${campus.code}`}
            >
              <h3 id={`campus-${campus.code}`}>{campus.name}</h3>
              <ul>
                {campus.programs.map((program) => (
                  <li key={program.code}>
                    <strong>{program.label}</strong>
                    {program.majors.length ? (
                      <ul aria-label={`Majors under ${program.code}`}>
                        {program.majors.map((major) => (
                          <li key={major}>{major}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="operations-footnote">
          This read-only list comes from the project’s canonical campus and
          program fixture. It is not an institutional configuration editor.
        </p>
      </section>
      <section
        className="operations-panel"
        aria-labelledby="admin-boundary-title"
      >
        <div className="operations-panel-heading">
          <div>
            <h2 id="admin-boundary-title">Administration scope</h2>
            <p>Light reference context for routine school-support work.</p>
          </div>
        </div>
        <p className="operations-reference-line">
          Employee functional areas are provisional demo groupings. Account,
          security, and developer controls are outside this page.
        </p>
      </section>
    </div>
  );
}

export function OperationsPage({
  section,
  title,
  description,
  isMaintenanceStaff,
  requestId,
  employeeId,
  ticketId,
  facilityView,
}: OperationsPageProps) {
  const { feedback, clearFeedback, requests, employees, tickets } =
    useOperationsDemo();
  useEffect(() => {
    clearFeedback();
  }, [section, requestId, employeeId, ticketId, clearFeedback]);

  let pageTitle = title;
  let pageDescription = description;
  if (section === "dashboard") {
    pageTitle = "Operations";
    pageDescription = isMaintenanceStaff
      ? "Your assigned facilities work and the sample tickets needing attention."
      : "Routine school-support work across a small Operations demo.";
  } else if (section === "student-services" && requestId) {
    pageTitle = `Request ${requestId}`;
    pageDescription =
      "Student Services · fictional request details and demo status.";
  } else if (section === "employees" && employeeId) {
    pageTitle = `Employee ${employeeId}`;
    pageDescription = "Fictional directory entry · demo grouping only.";
  } else if (section === "facilities" && ticketId) {
    pageTitle = `Ticket ${ticketId}`;
    pageDescription = "Facilities · fictional issue details and demo updates.";
  }
  const hasSelectedRecord =
    (section === "student-services" &&
      Boolean(requestId && requests.some((item) => item.id === requestId))) ||
    (section === "employees" &&
      Boolean(
        employeeId && employees.some((item) => item.id === employeeId),
      )) ||
    (section === "facilities" &&
      Boolean(ticketId && tickets.some((item) => item.id === ticketId)));

  return (
    <div
      className="operations-page"
      data-section={section}
      data-layout={
        section === "dashboard"
          ? "dashboard"
          : ticketId || requestId || employeeId
            ? "detail"
            : "wide"
      }
    >
      {hasSelectedRecord ? null : (
        <PageHeader title={pageTitle} description={pageDescription.trim()} />
      )}
      {feedback ? (
        <p className="operations-live-message" role="status">
          {feedback}
        </p>
      ) : null}
      {section === "dashboard" ? (
        <OperationsDashboard isMaintenanceStaff={isMaintenanceStaff} />
      ) : section === "student-services" ? (
        <StudentServices requestId={requestId} />
      ) : section === "employees" ? (
        <Employees employeeId={employeeId} />
      ) : section === "facilities" ? (
        <Facilities
          ticketId={ticketId}
          isMaintenanceStaff={isMaintenanceStaff}
          facilityView={facilityView}
        />
      ) : section === "administration" ? (
        <Administration />
      ) : (
        <EmptyState
          title="Operations page not found"
          detail="Choose a page from Operations navigation."
        />
      )}
    </div>
  );
}
