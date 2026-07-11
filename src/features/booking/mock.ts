import { Cinema, DateOption, Seat, SeatRow, SeatPrice } from "./types";

// Generate 5 days starting from today
const today = new Date();
export const DATES: DateOption[] = Array.from({ length: 10 }, (_, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() + i);
  return {
    value: d.toISOString().slice(0, 10),
    day: d.getDate(),
    month: d.toLocaleString("en", { month: "short" }).toUpperCase(),
    weekday:
      i === 0
        ? "TODAY"
        : d.toLocaleString("en", { weekday: "short" }).toUpperCase(),
  };
});

export const CINEMAS: Cinema[] = [
  {
    id: 1,
    name: "PrimeSeat Cinema Thủ Đức",
    address: "216 Võ Văn Ngân, TP. Thủ Đức, TP.HCM",
    distance: "2.1 km",
    badge: "IMAX",
    badgeColor: "bg-(--color-gold) text-(--color-bg)",
    showtimes: [
      { time: "11:30", available: true },
      { time: "14:45", available: true },
      { time: "18:15", available: true },
      { time: "21:30", available: true },
    ],
  },
  {
    id: 2,
    name: "PrimeSeat Cinema Gò Vấp",
    address: "19 Quang Trung, Q. Gò Vấp, TP.HCM",
    distance: "3.4 km",
    badge: "STANDARD",
    badgeColor: "bg-(--color-border) text-(--color-text-secondary)",
    showtimes: [
      { time: "12:15", available: true },
      { time: "15:30", available: true },
      { time: "19:00", available: false },
      { time: "22:15", available: true },
    ],
  },
  {
    id: 3,
    name: "PrimeSeat Cinema Quận 1",
    address: "135 Nguyễn Huệ, Q.1, TP.HCM",
    distance: "4.0 km",
    badge: "IMAX",
    badgeColor: "bg-(--color-gold) text-(--color-bg)",
    showtimes: [
      { time: "10:45", available: true },
      { time: "13:15", available: true },
      { time: "16:00", available: true },
      { time: "19:30", available: false },
      { time: "22:00", available: true },
    ],
  },
  {
    id: 4,
    name: "PrimeSeat Cinema Tân Bình",
    address: "11 Cửu Long, Q. Tân Bình, TP.HCM",
    distance: "5.2 km",
    badge: "DOLBY ATMOS",
    badgeColor: "bg-(--color-gold) text-(--color-bg)",
    showtimes: [
      { time: "11:00", available: true },
      { time: "14:00", available: true },
      { time: "17:30", available: true },
      { time: "21:00", available: true },
    ],
  },
  {
    id: 5,
    name: "PrimeSeat Cinema Bình Tân",
    address: "158 Bùi Tư Toàn, Q. Bình Tân, TP.HCM",
    distance: "6.8 km",
    badge: "STANDARD",
    badgeColor: "bg-(--color-border) text-(--color-text-secondary)",
    showtimes: [
      { time: "12:00", available: true },
      { time: "15:15", available: true },
      { time: "18:45", available: true },
      { time: "21:45", available: false },
    ],
  },
  {
    id: 6,
    name: "PrimeSeat Cinema Hà Nội",
    address: "282 Đào Tấn, Q. Ba Đình, Hà Nội",
    distance: "8.1 km",
    badge: "PREMIUM",
    badgeColor: "bg-(--color-gold) text-(--color-bg)",
    showtimes: [
      { time: "10:30", available: true },
      { time: "13:45", available: true },
      { time: "16:30", available: true },
      { time: "19:15", available: true },
      { time: "22:30", available: false },
    ],
  },
];

/* ─── Seat Map Data ───────────────────────────────────────── */

function seat(col: number, kind: Seat["kind"], status: Seat["status"] = "idle", pairId?: string): Seat {
  return { col, kind, status, pairId };
}

function regularRow(label: string, occupied: number[] = []): SeatRow {
  const seg = (start: number) =>
    Array.from({ length: 5 }, (_, i) => {
      const col = start + i;
      return seat(col, "available", occupied.includes(col) ? "occupied" : "idle");
    });
  return { label, segments: [seg(1), seg(6)] };
}

function vipRow(label: string, occupied: number[] = []): SeatRow {
  const seg = (start: number) =>
    Array.from({ length: 5 }, (_, i) => {
      const col = start + i;
      return seat(col, "vip", occupied.includes(col) ? "occupied" : "idle");
    });
  return { label, segments: [seg(1), seg(6)] };
}

function sweetBoxRow(label: string, occupiedPairs: string[] = []): SeatRow {
  const makePair = (pairId: string): Seat => ({
    col: parseInt(pairId.split("-")[0]),
    kind: "sweetbox",
    status: occupiedPairs.includes(pairId) ? "occupied" : "idle",
    pairId,
  });
  return {
    label,
    segments: [
      [makePair(`${label}-1-2`), makePair(`${label}-3-4`)],
      [makePair(`${label}-5-6`), makePair(`${label}-7-8`)],
    ],
  };
}

export const SEAT_ROWS: SeatRow[] = [
  regularRow("A"),
  regularRow("B", [2, 3, 7]),
  vipRow("C"),
  vipRow("D", [5, 9, 10]),
  vipRow("E", [1, 6, 7]),
  vipRow("F", [3, 8]),
  regularRow("G", [4, 5]),
  regularRow("H"),
  sweetBoxRow("I", ["I-3-4"]),
  sweetBoxRow("J", ["J-5-6", "J-7-8"]),
];

export const SEAT_PRICES: SeatPrice = {
  available: 90000,
  vip: 140000,
  sweetbox: 280000,
};

export const COUNTDOWN_SECONDS = 5 * 60 + 59; // 5m59s
export const MAX_SEATS_PER_BOOKING = 8;
export const SEAT_MAP_COLS = 10;
