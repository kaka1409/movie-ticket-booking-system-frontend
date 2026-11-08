export interface AdminCheckinResult {
  ticketId: string;
  bookingId: string;
  status: "used";
  usedAt: string;
  ownerName: string;
  movieTitle: string;
  cinemaName: string;
  roomName: string;
  roomNameVi: string | null;
  format: string;
  date: string;
  startTime: string;
  endTime: string;
  seatLabels: string[];
}
