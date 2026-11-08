export type AdminUserRole = "USER" | "ADMIN";

export type AdminUserStatus = "active" | "banned";


export interface AdminUser {
  id: string;
  fullname: string;
  email: string;
  phone?: string;
  avatarUrl?: string | null;
  role: string;
  status: string;
  createdAt: string;
  bookingCount: number;
}
