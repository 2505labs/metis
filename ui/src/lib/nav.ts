import { writable } from "svelte/store";

export type ViewId =
  | "dashboard"
  | "queue"
  | "log"
  | "calendar"
  | "email"
  | "files"
  | "settings";

export const currentView = writable<ViewId>("dashboard");

export interface NavItem {
  id: ViewId;
  label: string;
  icon: string; // material symbol
}

export const primaryNav: NavItem[] = [
  { id: "dashboard", label: "Main Console", icon: "terminal" },
  { id: "queue", label: "Confirm Queue", icon: "rule" },
  { id: "log", label: "Event Log", icon: "receipt_long" },
];

export const agentNav: NavItem[] = [
  { id: "calendar", label: "Calendar Agent", icon: "calendar_today" },
  { id: "email", label: "Email Agent", icon: "mail" },
  { id: "files", label: "Files Agent", icon: "folder_open" },
];
