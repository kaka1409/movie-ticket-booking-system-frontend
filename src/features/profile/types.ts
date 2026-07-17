export interface User {
  name: string;
  email: string;
  phone: string;
  dob: string;
  tier: "Member" | "Gold Member" | "Platinum";
  avatarUrl: string;
}
