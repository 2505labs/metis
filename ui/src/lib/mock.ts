// Mock data for the UI-first build. Replaced later by Tauri `invoke()` calls
// (queue_list, log read, files/calendar/email observe). Shapes match types.ts
// so the swap is mechanical.
import type { AgentInfo, QueueItem, LogEntry } from "./types";

export const agents: AgentInfo[] = [
  {
    kind: "calendar",
    name: "Calendar Agent",
    codename: "Chronos",
    tagline: "Calendar & Scheduling Intelligence",
    label: "CALENDAR_AGENT",
    icon: "calendar_month",
    status: "active",
    statusLabel: "Active",
    accent: "primary",
    connection: "Google",
    lastObservation: "2023-10-24 14:22:01.049",
    nextAction: "Finalizing Q4 Stakeholder Review (14:30)",
    pendingActions: 4,
    skills: ["list events", "read event", "propose: create event"],
  },
  {
    kind: "email",
    name: "Email Agent",
    codename: "Hermes",
    tagline: "Priority Inbox & Synthesis Engine",
    label: "EMAIL_AGENT",
    icon: "mail",
    status: "idle",
    statusLabel: "1 Pending",
    accent: "tertiary",
    connection: "Google",
    lastObservation: "2023-10-24 14:21:58.821",
    nextAction: "Update required: Vendor contract terms v.2",
    pendingActions: 7,
    skills: ["list threads", "read thread", "propose: draft reply"],
  },
  {
    kind: "files",
    name: "Files Agent",
    codename: "Atlas",
    tagline: "Knowledge Graph & File Indexer",
    label: "FILES_AGENT",
    icon: "folder_managed",
    status: "active",
    statusLabel: "Mapping",
    accent: "secondary",
    connection: "Local",
    lastObservation: "2023-10-24 14:22:03.112",
    nextAction: "Indexing research/exports — 82% complete",
    pendingActions: 1,
    skills: ["list dir", "read file", "search contents"],
  },
];

export const queue: QueueItem[] = [
  {
    id: "REQ-882",
    agent: "email",
    agentLabel: "EMAIL_AGENT",
    icon: "mail",
    tier: "ConfirmRequired",
    summary: "Send summary email to research team regarding project 'X-RAY'.",
    detail:
      "To: research@internal.net\nSubject: X-RAY weekly summary\n\nTeam — attaching this week's consolidated findings. Three experiments completed, two pending review. Full notes in the shared drive.",
    ts: "14:22:01",
  },
  {
    id: "REQ-904",
    agent: "calendar",
    agentLabel: "CALENDAR_AGENT",
    icon: "event",
    tier: "ConfirmRequired",
    summary: "Reschedule conflicting meeting 'Quarterly Review' to Friday 10AM.",
    detail:
      "Move: Quarterly Review\nFrom: Thu 2023-10-26 15:00\nTo:   Fri 2023-10-27 10:00\nAttendees: 6 — notifications will be sent on approval.",
    ts: "14:21:44",
  },
  {
    id: "REQ-910",
    agent: "email",
    agentLabel: "EMAIL_AGENT",
    icon: "drafts",
    tier: "ConfirmRequired",
    summary: "Draft follow-up response to 'Client Feedback' thread.",
    detail:
      "In reply to: \"Re: Client Feedback\" from dana@acme.com\n\nHi Dana — thanks for the detailed notes. We've logged the three issues and will have fixes in the next release. Happy to walk through them on a call.",
    ts: "14:21:30",
  },
  {
    id: "REQ-915",
    agent: "calendar",
    agentLabel: "CALENDAR_AGENT",
    icon: "event_available",
    tier: "ConfirmRequired",
    summary: "Create event 'Design sync' Wed 3PM with the product team.",
    detail:
      "New event: Design sync\nWhen: Wed 2023-10-25 15:00–15:45\nGuests: product@internal.net (4)\nLocation: Room Alpha / Meet link",
    ts: "14:20:58",
  },
];

export const log: LogEntry[] = [
  { id: "EXE-5103", ts: "14:22:06", kind: "Executed", agent: "FILES_AGENT", message: "Listed /volumes/data/research — 42 entries.", hash: "9f3a1c" },
  { id: "OBS-5102", ts: "14:22:04", kind: "Observed", agent: "EMAIL_AGENT", message: "Detected new incoming message from dana@acme.com.", hash: "b27e04" },
  { id: "PRO-5101", ts: "14:22:03", kind: "Proposed", agent: "EMAIL_AGENT", message: "Proposed draft reply to 'Client Feedback' (REQ-910).", hash: "c4d1aa" },
  { id: "OBS-5098", ts: "14:21:55", kind: "Observed", agent: "CALENDAR_AGENT", message: "Found scheduling conflict on 'Quarterly Review'.", hash: "1a4f47" },
  { id: "APP-5096", ts: "14:21:50", kind: "Approved", agent: "OPERATOR_01", message: "Approved REQ-871 — send standup notes.", hash: "00574d" },
  { id: "EXE-5095", ts: "14:21:42", kind: "Executed", agent: "CALENDAR_AGENT", message: "Confirmed entry 'Team Standup' for 09:00:00.", hash: "57f1db" },
  { id: "PRO-5092", ts: "14:21:30", kind: "Proposed", agent: "EMAIL_AGENT", message: "Drafted 'RE: Inquiry' to operator review queue.", hash: "2dd4bf" },
  { id: "REJ-5090", ts: "14:21:24", kind: "Rejected", agent: "OPERATOR_01", message: "Rejected REQ-860 — bulk archive (too broad).", hash: "93000a" },
  { id: "OBS-5089", ts: "14:21:22", kind: "Observed", agent: "FILES_AGENT", message: "Scanned '/volumes/data' for large temporary assets.", hash: "3c4a46" },
  { id: "OBS-5084", ts: "14:21:10", kind: "Observed", agent: "CALENDAR_AGENT", message: "Monitoring 4 upcoming high-priority events.", hash: "859490" },
  { id: "OBS-5081", ts: "14:21:05", kind: "Observed", agent: "EMAIL_AGENT", message: "Indexed 12 unread threads in primary inbox.", hash: "62fae3" },
  { id: "EXE-5079", ts: "14:20:58", kind: "Executed", agent: "FILES_AGENT", message: "Read research/exports/notes.md (4.2 KB).", hash: "006b5f" },
];
