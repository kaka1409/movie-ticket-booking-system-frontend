import { getAdminCinemas, getAdminMovies } from "./api";
import type {
  AdminAnalyticsDataPoint,
  AdminDashboardData,
  AdminKpiDataPoint,
  AdminKpiOccupancyRange,
  AdminKpiRangeData,
  AdminKpiSummary,
  AdminLiveBookingItem,
  AdminLiveShowtimeItem,
  AdminMovie,
  AdminTopMoviePerformance,
} from "./types";

/**
 * Builds analytics datasets for 7-day, 30-day, and 12-month periods.
 */
function buildAnalyticsDatasets(): {
  range7d: AdminAnalyticsDataPoint[];
  range30d: AdminAnalyticsDataPoint[];
  range12m: AdminAnalyticsDataPoint[];
} {
  const range7d: AdminAnalyticsDataPoint[] = [
    {
      label: "T2",
      ticketRevenue: 28500000,
      fnbRevenue: 6800000,
      totalRevenue: 35300000,
      attendance: 290,
    },
    {
      label: "T3",
      ticketRevenue: 31200000,
      fnbRevenue: 7500000,
      totalRevenue: 38700000,
      attendance: 320,
    },
    {
      label: "T4",
      ticketRevenue: 42000000,
      fnbRevenue: 10200000,
      totalRevenue: 52200000,
      attendance: 440,
    },
    {
      label: "T5",
      ticketRevenue: 36800000,
      fnbRevenue: 8900000,
      totalRevenue: 45700000,
      attendance: 380,
    },
    {
      label: "T6",
      ticketRevenue: 58000000,
      fnbRevenue: 14500000,
      totalRevenue: 72500000,
      attendance: 590,
    },
    {
      label: "T7",
      ticketRevenue: 88500000,
      fnbRevenue: 22800000,
      totalRevenue: 111300000,
      attendance: 890,
    },
    {
      label: "CN",
      ticketRevenue: 94200000,
      fnbRevenue: 24600000,
      totalRevenue: 118800000,
      attendance: 950,
    },
  ];

  const range30d: AdminAnalyticsDataPoint[] = [
    {
      label: "Tuần 1",
      ticketRevenue: 215000000,
      fnbRevenue: 53800000,
      totalRevenue: 268800000,
      attendance: 2180,
    },
    {
      label: "Tuần 2",
      ticketRevenue: 248000000,
      fnbRevenue: 61500000,
      totalRevenue: 309500000,
      attendance: 2540,
    },
    {
      label: "Tuần 3",
      ticketRevenue: 289000000,
      fnbRevenue: 72400000,
      totalRevenue: 361400000,
      attendance: 2950,
    },
    {
      label: "Tuần 4",
      ticketRevenue: 312000000,
      fnbRevenue: 78900000,
      totalRevenue: 390900000,
      attendance: 3180,
    },
  ];

  const range12m: AdminAnalyticsDataPoint[] = [
    {
      label: "Th01",
      ticketRevenue: 980000000,
      fnbRevenue: 245000000,
      totalRevenue: 1225000000,
      attendance: 9800,
    },
    {
      label: "Th02",
      ticketRevenue: 1420000000,
      fnbRevenue: 368000000,
      totalRevenue: 1788000000,
      attendance: 14300,
    },
    {
      label: "Th03",
      ticketRevenue: 890000000,
      fnbRevenue: 218000000,
      totalRevenue: 1108000000,
      attendance: 8950,
    },
    {
      label: "Th04",
      ticketRevenue: 1120000000,
      fnbRevenue: 284000000,
      totalRevenue: 1404000000,
      attendance: 11200,
    },
    {
      label: "Th05",
      ticketRevenue: 1350000000,
      fnbRevenue: 342000000,
      totalRevenue: 1692000000,
      attendance: 13600,
    },
    {
      label: "Th06",
      ticketRevenue: 1280000000,
      fnbRevenue: 325000000,
      totalRevenue: 1605000000,
      attendance: 12900,
    },
    {
      label: "Th07",
      ticketRevenue: 1460000000,
      fnbRevenue: 372000000,
      totalRevenue: 1832000000,
      attendance: 14700,
    },
    {
      label: "Th08",
      ticketRevenue: 1240000000,
      fnbRevenue: 310000000,
      totalRevenue: 1550000000,
      attendance: 12500,
    },
    {
      label: "Th09",
      ticketRevenue: 1050000000,
      fnbRevenue: 262000000,
      totalRevenue: 1312000000,
      attendance: 10600,
    },
    {
      label: "Th10",
      ticketRevenue: 1180000000,
      fnbRevenue: 298000000,
      totalRevenue: 1478000000,
      attendance: 11900,
    },
    {
      label: "Th11",
      ticketRevenue: 1320000000,
      fnbRevenue: 335000000,
      totalRevenue: 1655000000,
      attendance: 13300,
    },
    {
      label: "Th12",
      ticketRevenue: 1580000000,
      fnbRevenue: 405000000,
      totalRevenue: 1985000000,
      attendance: 16100,
    },
  ];

  return { range7d, range30d, range12m };
}

/** Zips parallel label/value arrays into chart points. */
function kpiPoints(labels: string[], values: number[]): AdminKpiDataPoint[] {
  return labels.map((label, index) => ({ label, value: values[index] ?? 0 }));
}

function kpiWindow(
  value: number,
  growthPercent: number,
  labels: string[],
  values: number[],
): AdminKpiRangeData {
  return { value, growthPercent, series: kpiPoints(labels, values) };
}

const WEEK_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTH_LABELS = Array.from({ length: 12 }, (_, index) => `Th${String(index + 1).padStart(2, "0")}`);
const WEEK_BLOCK_LABELS = ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"];

/**
 * Builds the 4 KPI cards' per-range payloads (7d / 30d / 12m). Revenue and
 * concessions series are in millions of VND to match the chart tick formatters;
 * `value` stays in full VND for `formatVND`.
 */
function buildKpiSummary(): AdminKpiSummary {
  const revenue: AdminKpiSummary["revenue"] = {
    "7d": kpiWindow(1520000000, 9.4, WEEK_LABELS, [188, 205, 196, 224, 218, 231, 258]),
    "30d": kpiWindow(1385000000, 12.6, WEEK_BLOCK_LABELS, [298, 342, 389, 356]),
    "12m": kpiWindow(15880000000, 21.3, MONTH_LABELS, [
      980, 1240, 860, 1120, 1360, 1290, 1480, 1250, 1060, 1190, 1340, 1610,
    ]),
  };

  const tickets: AdminKpiSummary["tickets"] = {
    "7d": kpiWindow(13290, 7.9, WEEK_LABELS, [1620, 1780, 1710, 1950, 1890, 2080, 2260]),
    "30d": kpiWindow(45400, 10.4, WEEK_BLOCK_LABELS, [9800, 11200, 12800, 11600]),
    "12m": kpiWindow(561200, 16.8, MONTH_LABELS, [
      38200, 45600, 34100, 42800, 51200, 48600, 55400, 47100, 40200, 44800, 50900, 62300,
    ]),
  };

  const concessions: AdminKpiSummary["concessions"] = {
    "7d": kpiWindow(354000000, 11.8, WEEK_LABELS, [42, 48, 45, 52, 50, 55, 62]),
    "30d": kpiWindow(369000000, 14.2, WEEK_BLOCK_LABELS, [78, 92, 104, 95]),
    "12m": kpiWindow(3200000000, 18.6, MONTH_LABELS, [
      210, 268, 185, 242, 295, 280, 322, 272, 230, 258, 290, 348,
    ]),
  };

  const occupancyWindow = (
    ratePercent: number,
    peakPercent: number,
    differenceFromAverage: number,
    daysInRange: number,
    labels: string[],
    values: number[],
  ): AdminKpiOccupancyRange => {
    const totalSeats = 2350 * daysInRange;
    return {
      ratePercent,
      peakPercent,
      differenceFromAverage,
      totalSeats,
      bookedSeats: Math.round((ratePercent / 100) * totalSeats),
      series: kpiPoints(labels, values),
    };
  };

  const occupancy: AdminKpiSummary["occupancy"] = {
    "7d": occupancyWindow(78.4, 84, 4.2, 7, WEEK_LABELS, [74, 76, 75, 80, 78, 82, 78]),
    "30d": occupancyWindow(73.8, 81, 2.8, 30, WEEK_BLOCK_LABELS, [71, 74, 76, 73]),
    "12m": occupancyWindow(72.6, 83, 1.4, 365, MONTH_LABELS, [
      68, 72, 70, 75, 78, 76, 80, 74, 71, 73, 77, 79,
    ]),
  };

  // avgTicketPrice: `value`/series are full VND; rate metrics are percents;
  // pendingPayments counts open payment intents at each bucket.
  const avgTicketPrice: AdminKpiSummary["avgTicketPrice"] = {
    "7d": kpiWindow(87000, 3.2, WEEK_LABELS, [
      82000, 84000, 81000, 86000, 88000, 90000, 92000,
    ]),
    "30d": kpiWindow(86500, 2.1, WEEK_BLOCK_LABELS, [84000, 86000, 88000, 87000]),
    "12m": kpiWindow(91000, 6.4, MONTH_LABELS, [
      79000, 82000, 84000, 86000, 88000, 90000, 92000, 93000, 91000, 89000, 90000, 96000,
    ]),
  };

  const attachRate: AdminKpiSummary["attachRate"] = {
    "7d": kpiWindow(41, 5.1, WEEK_LABELS, [38, 40, 39, 42, 41, 43, 45]),
    "30d": kpiWindow(38, 4.0, WEEK_BLOCK_LABELS, [36, 38, 40, 39]),
    "12m": kpiWindow(40, 9.6, MONTH_LABELS, [
      30, 32, 34, 35, 37, 36, 39, 38, 36, 37, 39, 42,
    ]),
  };

  const checkinRate: AdminKpiSummary["checkinRate"] = {
    "7d": kpiWindow(91, 1.8, WEEK_LABELS, [88, 90, 89, 91, 92, 90, 93]),
    "30d": kpiWindow(88, 1.2, WEEK_BLOCK_LABELS, [86, 88, 89, 87]),
    "12m": kpiWindow(89, 2.4, MONTH_LABELS, [
      82, 84, 85, 86, 87, 88, 89, 88, 87, 88, 90, 91,
    ]),
  };

  const pendingPayments: AdminKpiSummary["pendingPayments"] = {
    "7d": kpiWindow(24, 12.5, WEEK_LABELS, [12, 18, 15, 22, 19, 26, 31]),
    "30d": kpiWindow(118, 8.7, WEEK_BLOCK_LABELS, [95, 110, 120, 104]),
    "12m": kpiWindow(1150, 14.2, MONTH_LABELS, [
      820, 940, 780, 1020, 1180, 1240, 1320, 1150, 1080, 1120, 1260, 1480,
    ]),
  };

  return { revenue, tickets, concessions, occupancy, avgTicketPrice, attachRate, checkinRate, pendingPayments };
}

/**
 * Aggregates live catalog movies, cinemas, and operations into the dashboard payload.
 */
export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [moviesResponse, cinemasResponse] = await Promise.all([
    getAdminMovies({ limit: 20 }),
    getAdminCinemas(),
  ]);

  const movies: AdminMovie[] = "data" in moviesResponse ? moviesResponse.data.movies : [];
  const cinemas = "data" in cinemasResponse ? cinemasResponse.data : [];

  const defaultMovieTitle = movies[0]?.title ?? "Dune: Hành Tinh Cát - Phần 2";
  const defaultPoster = movies[0]?.posterUrl ?? "/images/placeholder-movie.jpg";

  const topMovies: AdminTopMoviePerformance[] = movies.slice(0, 5).map((movie, index) => {
    const rank = index + 1;
    const baseRevenue = Math.max(15000000, 95000000 - index * 16500000);
    const tickets = Math.round(baseRevenue / 110000);
    const occupancy = Math.max(55, Math.round(92 - index * 7.5));
    const genreNames = movie.genres.map((genre) => genre.nameVi || genre.name).join(", ");

    return {
      id: movie.id,
      rank,
      title: movie.title,
      posterUrl: movie.posterUrl || defaultPoster,
      genre: genreNames || "Hành động, Phiêu lưu",
      revenue: baseRevenue,
      ticketsSold: tickets,
      occupancyRate: occupancy,
    };
  });

  // Fallback top movies if catalog is newly created or empty
  if (topMovies.length === 0) {
    topMovies.push(
      {
        id: "fallback-1",
        rank: 1,
        title: "Dune: Hành Tinh Cát - Phần 2",
        posterUrl: "/images/placeholder-movie.jpg",
        genre: "Khoa học viễn tưởng, Phiêu lưu",
        revenue: 92450000,
        ticketsSold: 840,
        occupancyRate: 89,
      },
      {
        id: "fallback-2",
        rank: 2,
        title: "Mai (Trấn Thành)",
        posterUrl: "/images/placeholder-movie.jpg",
        genre: "Tâm lý, Tình cảm",
        revenue: 78300000,
        ticketsSold: 712,
        occupancyRate: 84,
      },
      {
        id: "fallback-3",
        rank: 3,
        title: "Kung Fu Panda 4",
        posterUrl: "/images/placeholder-movie.jpg",
        genre: "Hoạt hình, Hài",
        revenue: 45600000,
        ticketsSold: 415,
        occupancyRate: 72,
      },
    );
  }

  const primaryCinemaName = cinemas[0]?.name ?? "PrimeSeat Landmark 81";
  const primaryRoomName = cinemas[0]?.rooms?.[0]?.name ?? "Phòng 01 (IMAX Laser)";

  const liveShowtimes: AdminLiveShowtimeItem[] = [
    {
      id: "st-1",
      startTime: "14:15",
      endTime: "16:45",
      movieTitle: movies[0]?.title ?? "Dune: Hành Tinh Cát - Phần 2",
      posterUrl: movies[0]?.posterUrl ?? defaultPoster,
      cinemaName: primaryCinemaName,
      roomName: primaryRoomName,
      format: "IMAX Laser",
      bookedSeats: 198,
      totalSeats: 220,
      status: "in_screen",
    },
    {
      id: "st-2",
      startTime: "15:00",
      endTime: "17:10",
      movieTitle: movies[1]?.title ?? "Kung Fu Panda 4",
      posterUrl: movies[1]?.posterUrl ?? defaultPoster,
      cinemaName: primaryCinemaName,
      roomName: cinemas[0]?.rooms?.[1]?.name ?? "Phòng 02 (Dolby Atmos)",
      format: "2D Lồng tiếng",
      bookedSeats: 142,
      totalSeats: 150,
      status: "almost_full",
    },
    {
      id: "st-3",
      startTime: "16:30",
      endTime: "18:45",
      movieTitle: movies[2]?.title ?? "Godzilla x Kong: Đế Chế Mới",
      posterUrl: movies[2]?.posterUrl ?? defaultPoster,
      cinemaName: cinemas[1]?.name ?? "PrimeSeat Crescent Mall",
      roomName: "Phòng 03",
      format: "3D Phụ đề",
      bookedSeats: 180,
      totalSeats: 180,
      status: "sold_out",
    },
    {
      id: "st-4",
      startTime: "17:45",
      endTime: "20:15",
      movieTitle: defaultMovieTitle,
      posterUrl: defaultPoster,
      cinemaName: primaryCinemaName,
      roomName: primaryRoomName,
      format: "IMAX Laser",
      bookedSeats: 88,
      totalSeats: 220,
      status: "selling",
    },
    {
      id: "st-5",
      startTime: "18:30",
      endTime: "20:40",
      movieTitle: movies[1]?.title ?? "Kung Fu Panda 4",
      posterUrl: movies[1]?.posterUrl ?? defaultPoster,
      cinemaName: cinemas[1]?.name ?? "PrimeSeat Crescent Mall",
      roomName: "Phòng 01",
      format: "2D Phụ đề",
      bookedSeats: 64,
      totalSeats: 160,
      status: "selling",
    },
  ];

  const liveBookings: AdminLiveBookingItem[] = [
    {
      id: "bk-1",
      bookingCode: "PS-89214",
      customerName: "Nguyễn Minh Tuấn",
      customerPhone: "0908•••412",
      movieTitle: movies[0]?.title ?? "Dune: Hành Tinh Cát - Phần 2",
      cinemaName: primaryCinemaName,
      roomName: primaryRoomName,
      showtime: "17:45 Hôm nay",
      seatCount: 2,
      comboCount: 1,
      totalAmount: 340000,
      paymentMethod: "VNPay",
      status: "paid",
      createdAt: "2 phút trước",
    },
    {
      id: "bk-2",
      bookingCode: "PS-89213",
      customerName: "Trần Bảo Ngọc",
      customerPhone: "0934•••889",
      movieTitle: movies[1]?.title ?? "Kung Fu Panda 4",
      cinemaName: primaryCinemaName,
      roomName: "Phòng 02",
      showtime: "18:30 Hôm nay",
      seatCount: 3,
      comboCount: 2,
      totalAmount: 485000,
      paymentMethod: "MoMo",
      status: "paid",
      createdAt: "5 phút trước",
    },
    {
      id: "bk-3",
      bookingCode: "PS-89212",
      customerName: "Lê Hoàng Long",
      isGuest: true,
      movieTitle: movies[0]?.title ?? "Dune: Hành Tinh Cát - Phần 2",
      cinemaName: cinemas[1]?.name ?? "PrimeSeat Crescent Mall",
      roomName: "Phòng 01",
      showtime: "20:15 Hôm nay",
      seatCount: 2,
      comboCount: 0,
      totalAmount: 260000,
      paymentMethod: "Visa / Master",
      status: "paid",
      createdAt: "9 phút trước",
    },
    {
      id: "bk-4",
      bookingCode: "PS-89211",
      customerName: "Phạm Thùy Trang",
      customerPhone: "0912•••670",
      movieTitle: movies[2]?.title ?? "Godzilla x Kong",
      cinemaName: primaryCinemaName,
      roomName: "Phòng 03",
      showtime: "19:00 Hôm nay",
      seatCount: 4,
      comboCount: 2,
      totalAmount: 640000,
      paymentMethod: "VNPay",
      status: "holding",
      createdAt: "12 phút trước",
    },
    {
      id: "bk-5",
      bookingCode: "PS-89210",
      customerName: "Vũ Đức Huy",
      customerPhone: "0987•••331",
      movieTitle: defaultMovieTitle,
      cinemaName: primaryCinemaName,
      roomName: primaryRoomName,
      showtime: "21:30 Hôm nay",
      seatCount: 2,
      comboCount: 1,
      totalAmount: 340000,
      paymentMethod: "ZaloPay",
      status: "paid",
      createdAt: "18 phút trước",
    },
  ];

  return {
    kpi: buildKpiSummary(),
    analytics: buildAnalyticsDatasets(),
    topMovies,
    liveShowtimes,
    liveBookings,
  };
}
