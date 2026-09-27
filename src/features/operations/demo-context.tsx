"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initialFacilityTickets,
  initialOperationsActivity,
  initialStudentServiceRequests,
  initialEmployees,
  updateFacilityAssignee,
  updateFacilityStatus,
  updateStudentServiceStatus,
  type FacilityStatus,
  type OperationsActivity,
  type StudentServiceStatus,
} from "./demo-data";

function todayLabel() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

function useOperationsDemoState() {
  const [requests, setRequests] = useState(initialStudentServiceRequests);
  const [tickets, setTickets] = useState(initialFacilityTickets);
  const [activity, setActivity] = useState(initialOperationsActivity);
  const [feedback, setFeedback] = useState("");

  const addActivity = useCallback((item: OperationsActivity) => {
    setActivity((current) => [item, ...current].slice(0, 8));
  }, []);

  const updateRequestStatus = useCallback(
    (id: string, status: StudentServiceStatus, outcomeNote = "") => {
      const request = requests.find((item) => item.id === id);
      if (!request) return false;
      const date = todayLabel();
      const updated = updateStudentServiceStatus(
        request,
        status,
        date,
        outcomeNote,
      );
      if (!updated) {
        setFeedback(
          "Add a short outcome note before resolving or closing this demo request.",
        );
        return false;
      }
      setRequests((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      );
      setFeedback(`Demo request ${id} updated to ${status}.`);
      addActivity({
        id: `activity-request-${Date.now()}`,
        date,
        label:
          status === "Resolved" || status === "Closed"
            ? `Demo request ${id} marked ${status}: ${outcomeNote.trim()}`
            : `Demo request ${id} moved to ${status}`,
        href: `/operations/student-services?request=${id}`,
      });
      return true;
    },
    [addActivity, requests],
  );

  const updateTicketStatus = useCallback(
    (id: string, status: FacilityStatus, completionNote = "") => {
      const ticket = tickets.find((item) => item.id === id);
      if (!ticket) return false;
      const date = todayLabel();
      const updated = updateFacilityStatus(
        ticket,
        status,
        date,
        completionNote,
      );
      if (!updated) {
        setFeedback(
          "Add a short outcome note before resolving or closing this demo ticket.",
        );
        return false;
      }
      setTickets((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      );
      setFeedback(`Demo ticket ${id} updated to ${status}.`);
      addActivity({
        id: `activity-ticket-${Date.now()}`,
        date,
        label: `Demo ticket ${id} moved to ${status}`,
        href: `/operations/facilities?ticket=${id}`,
      });
      return true;
    },
    [addActivity, tickets],
  );

  const assignTicket = useCallback(
    (id: string, assigneeId: string | null) => {
      const ticket = tickets.find((item) => item.id === id);
      if (!ticket) return false;
      const date = todayLabel();
      const updated = updateFacilityAssignee(ticket, assigneeId, date);
      if (!updated) return false;
      setTickets((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      );
      const assignee = initialEmployees.find(
        (employee) => employee.id === assigneeId,
      );
      setFeedback(
        assignee
          ? `Demo ticket ${id} assigned to ${assignee.name}.`
          : `Demo ticket ${id} assignment cleared.`,
      );
      addActivity({
        id: `activity-assignment-${Date.now()}`,
        date,
        label: assignee
          ? `Demo ticket ${id} assigned to ${assignee.name}`
          : `Demo ticket ${id} assignment cleared`,
        href: `/operations/facilities?ticket=${id}`,
      });
      return true;
    },
    [addActivity, tickets],
  );

  const clearFeedback = useCallback(() => setFeedback(""), []);

  return useMemo(
    () => ({
      requests,
      tickets,
      employees: initialEmployees,
      activity,
      feedback,
      setFeedback,
      clearFeedback,
      updateRequestStatus,
      updateTicketStatus,
      assignTicket,
    }),
    [
      requests,
      tickets,
      activity,
      feedback,
      clearFeedback,
      updateRequestStatus,
      updateTicketStatus,
      assignTicket,
    ],
  );
}

type OperationsDemoValue = ReturnType<typeof useOperationsDemoState>;
const OperationsDemoContext = createContext<OperationsDemoValue | null>(null);

export function OperationsDemoProvider({ children }: { children: ReactNode }) {
  const value = useOperationsDemoState();
  return (
    <OperationsDemoContext value={value}>{children}</OperationsDemoContext>
  );
}

export function useOperationsDemo() {
  const value = useContext(OperationsDemoContext);
  if (!value) {
    throw new Error("Operations demo requires its guarded portal layout.");
  }
  return value;
}
