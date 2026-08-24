import type { TicketStatus } from "./constants";

export interface SeatTicket {
  label: string;
  type: string;
  price: number;
}

export interface FoodDrinkItem {
  name: string;
  price: number;
  qty: number;
}

export interface UpcomingTicket {
  id: string;
  status: Extract<TicketStatus, "success" | "failed" | "pending" | "confirmed">;
  movie: string;
  datetime: string;
  cinema: string;
  location?: string;
  format: string;
  seatItems: SeatTicket[];
  poster: string;
  room?: string;
  ageRating?: string;
  totalPrice?: string;
  paymentMethod?: string;
  foodDrink?: FoodDrinkItem[];
}

export interface PastTicket {
  id: string;
  status: Extract<TicketStatus, "used" | "expired" | "cancelled" | "refunded">;
  movie: string;
  format: string;
  datetime: string;
  ticketCount: number;
  poster: string;
  cinema: string;
  location?: string;
  seatItems: SeatTicket[];
  room?: string;
  ageRating?: string;
  totalPrice?: string;
  paymentMethod?: string;
  foodDrink?: FoodDrinkItem[];
}
