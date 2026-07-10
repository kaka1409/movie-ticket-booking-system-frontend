export interface User {
  name: string;
  tier: "Member" | "Gold Member" | "Platinum";
  avatarUrl: string;
}
