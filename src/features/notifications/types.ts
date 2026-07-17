export type NotifType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: number;
  type: NotifType;
  title: string;
  message: string | React.ReactNode;
  time: string;
  meta?: string;
  action?: { label: string; href: string };
  read: boolean;
}
