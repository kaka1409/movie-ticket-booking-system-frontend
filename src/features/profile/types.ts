export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dob: string | null;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
}

export interface UpdateProfileRequest {
  fullname?: string;
  phone?: string;
  dob?: string;
}
