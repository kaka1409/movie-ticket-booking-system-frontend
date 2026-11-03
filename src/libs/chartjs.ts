import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Chart.js requires manual component registration in modern modular builds.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

/**
 * Chart canvas color tokens for light and dark admin modes. Canvas elements
 * cannot resolve CSS custom variables automatically at paint time, so these
 * structured palettes supply calibrated contrast values.
 */
export interface ChartPalette {
  isLight: boolean;
  gold: string;
  goldAlpha: string;
  cyan: string;
  cyanAlpha: string;
  emerald: string;
  emeraldAlpha: string;
  purple: string;
  purpleAlpha: string;
  textPrimary: string;
  textMuted: string;
  gridLine: string;
  surface: string;
  surfaceTrack: string;
  tooltipBg: string;
  tooltipBorder: string;
}

export const DARK_CHART_PALETTE: ChartPalette = {
  isLight: false,
  gold: "#ffcc4d",
  goldAlpha: "rgba(255, 204, 77, 0.18)",
  cyan: "#38bdf8",
  cyanAlpha: "rgba(56, 189, 248, 0.18)",
  emerald: "#34d399",
  emeraldAlpha: "rgba(52, 211, 153, 0.18)",
  purple: "#c084fc",
  purpleAlpha: "rgba(192, 132, 252, 0.18)",
  textPrimary: "#f6f6f4",
  textMuted: "#8e8e8e",
  gridLine: "rgba(255, 255, 255, 0.08)",
  surface: "#1c1b1b",
  surfaceTrack: "#2e2e2e",
  tooltipBg: "#1c1b1b",
  tooltipBorder: "#383838",
};

export const LIGHT_CHART_PALETTE: ChartPalette = {
  isLight: true,
  gold: "#8a6100",
  goldAlpha: "rgba(138, 97, 0, 0.14)",
  cyan: "#0284c7",
  cyanAlpha: "rgba(2, 132, 199, 0.14)",
  emerald: "#059669",
  emeraldAlpha: "rgba(5, 150, 105, 0.14)",
  purple: "#7c3aed",
  purpleAlpha: "rgba(124, 58, 237, 0.14)",
  textPrimary: "#14130f",
  textMuted: "#6f6a60",
  gridLine: "rgba(0, 0, 0, 0.08)",
  surface: "#ffffff",
  surfaceTrack: "#e4e3df",
  tooltipBg: "#ffffff",
  tooltipBorder: "#e4e3df",
};

/**
 * Returns either dark or light chart palette according to active theme mode.
 */
export function getChartPalette(isLight: boolean): ChartPalette {
  return isLight ? LIGHT_CHART_PALETTE : DARK_CHART_PALETTE;
}

export { ChartJS };
