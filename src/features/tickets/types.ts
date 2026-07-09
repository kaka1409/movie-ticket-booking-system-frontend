import type { TicketStatus } from "./constants";

export interface FoodDrinkItem {
  name: string;
  price: string;
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
  seats: string;
  seatPrice: string;
  poster: string;
  screen?: string;
  seatClass?: string;
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
  seats: string;
  seatPrice: string;
  screen?: string;
  seatClass?: string;
  ageRating?: string;
  totalPrice?: string;
  paymentMethod?: string;
  foodDrink?: FoodDrinkItem[];
}
