export interface ShowtimeCinema {
  id: string;
  name: string;
  address: string;
  badge: string;
}

export interface MovieShowtime {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  format: string;
  roomId: string;
  roomName: string;
  cinema: ShowtimeCinema;
}
