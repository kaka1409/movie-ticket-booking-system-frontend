"use client";

import { useEffect, useRef } from "react";

interface InteractiveItem {
  id: string;
  baseX: number;
  baseY: number;
  baseRot: number;
  radius: number;
  maxPush: number;
  freq: number;
  amplitude: number;
  rotAmplitude: number;
  phase: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
}

const ITEMS_CONFIG: Omit<InteractiveItem, "currentX" | "currentY" | "targetX" | "targetY">[] = [
  // Popcorn Cluster 1 (Top Left)
  {
    id: "popcorn-1",
    baseX: 135,
    baseY: 135,
    baseRot: 0,
    radius: 140,
    maxPush: 55,
    freq: 1.8,
    amplitude: 8,
    rotAmplitude: 3,
    phase: 0.2,
  },
  // Popcorn Cluster 2 (Top Right)
  {
    id: "popcorn-2",
    baseX: 365,
    baseY: 115,
    baseRot: 0,
    radius: 140,
    maxPush: 55,
    freq: 1.5,
    amplitude: 10,
    rotAmplitude: -3.5,
    phase: 1.8,
  },
  // Popcorn Cluster 3 (Left Mid)
  {
    id: "popcorn-3",
    baseX: 85,
    baseY: 280,
    baseRot: 0,
    radius: 120,
    maxPush: 45,
    freq: 1.6,
    amplitude: 7,
    rotAmplitude: 2,
    phase: 3.2,
  },
  // Popcorn Cluster 4 (Right Mid)
  {
    id: "popcorn-4",
    baseX: 410,
    baseY: 250,
    baseRot: 0,
    radius: 130,
    maxPush: 50,
    freq: 1.9,
    amplitude: 9,
    rotAmplitude: -2.5,
    phase: 4.5,
  },
  // Popcorn Burst 5 (Bottom Center)
  {
    id: "popcorn-5",
    baseX: 250,
    baseY: 485,
    baseRot: 0,
    radius: 150,
    maxPush: 50,
    freq: 1.4,
    amplitude: 8,
    rotAmplitude: 3,
    phase: 2.7,
  },
  // Ticket 1 (Primary Gold Ticket)
  {
    id: "ticket-1",
    baseX: 260,
    baseY: 310,
    baseRot: -14,
    radius: 180,
    maxPush: 35,
    freq: 1.1,
    amplitude: 6,
    rotAmplitude: 1.5,
    phase: 0.5,
  },
  // Ticket 2 (Secondary White Ticket)
  {
    id: "ticket-2",
    baseX: 250,
    baseY: 320,
    baseRot: 16,
    radius: 170,
    maxPush: 28,
    freq: 0.9,
    amplitude: 5,
    rotAmplitude: -1.5,
    phase: 3.8,
  },
];

/**
 * Interactive Abstract Cinema Artwork for LoginPrompt.
 * - Strictly uses Gold (#ffcc4d) and White (#ffffff) on deep dark canvas (#151515).
 * - Organic zero-gravity floating motion on popcorn clusters and tickets.
 * - Cursor repulsion physics: elements smoothly glide away from mouse and spring back.
 * - Coordinates managed in pure SVG user space, eliminating CSS transform overrides.
 */
export default function LoginPromptArt() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, SVGGElement | null>>({});
  const itemsRef = useRef<InteractiveItem[]>(
    ITEMS_CONFIG.map((item) => ({
      ...item,
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
    })),
  );
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      const mouse = mouseRef.current;
      const time = performance.now() * 0.001;

      itemsRef.current.forEach((item) => {
        if (mouse.active) {
          const deltaX = item.baseX - mouse.x;
          const deltaY = item.baseY - mouse.y;
          const distance = Math.hypot(deltaX, deltaY);

          if (distance < item.radius && distance > 0) {
            // Smooth non-linear repulsion curve
            const intensity = Math.pow(1 - distance / item.radius, 1.4);
            const force = intensity * item.maxPush;
            item.targetX = (deltaX / distance) * force;
            item.targetY = (deltaY / distance) * force;
          } else {
            item.targetX = 0;
            item.targetY = 0;
          }
        } else {
          item.targetX = 0;
          item.targetY = 0;
        }

        // Spring damping interpolation
        item.currentX += (item.targetX - item.currentX) * 0.12;
        item.currentY += (item.targetY - item.currentY) * 0.12;

        // Mathematical zero-gravity floating wave
        const floatY = Math.sin(time * item.freq + item.phase) * item.amplitude;
        const floatX = Math.cos(time * (item.freq * 0.7) + item.phase) * (item.amplitude * 0.35);
        const floatRot = Math.sin(time * item.freq + item.phase) * item.rotAmplitude;

        const posX = item.baseX + item.currentX + floatX;
        const posY = item.baseY + item.currentY + floatY;
        const rot = item.baseRot + floatRot;

        const node = elementsRef.current[item.id];
        if (node) {
          node.setAttribute(
            "transform",
            `translate(${posX.toFixed(2)}, ${posY.toFixed(2)}) rotate(${rot.toFixed(2)})`,
          );
        }
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Map client pointer coordinates precisely to SVG 520 x 620 user space
    const mouseX = ((event.clientX - rect.left) / rect.width) * 520;
    const mouseY = ((event.clientY - rect.top) / rect.height) * 620;
    mouseRef.current = { x: mouseX, y: mouseY, active: true };
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#151515] p-6 lg:p-10 select-none"
    >
      <svg
        viewBox="0 0 520 620"
        className="h-full w-full max-h-[580px] max-w-[480px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background Ambient Concentric Projector Rings */}
        <g stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1.5">
          <circle cx="260" cy="300" r="240" strokeDasharray="4 6" />
          <circle cx="260" cy="300" r="180" />
          <circle cx="260" cy="300" r="120" strokeDasharray="3 5" />
          <circle cx="260" cy="300" r="60" />
          <line x1="20" y1="300" x2="500" y2="300" />
          <line x1="260" y1="60" x2="260" y2="540" />
        </g>

        {/* Diagonal Projector Ray Beam Lines */}
        <line
          x1="60"
          y1="520"
          x2="460"
          y2="80"
          stroke="#ffcc4d"
          strokeOpacity="0.25"
          strokeWidth="2"
        />
        <line
          x1="80"
          y1="540"
          x2="480"
          y2="100"
          stroke="#ffffff"
          strokeOpacity="0.12"
          strokeWidth="1"
          strokeDasharray="6 6"
        />

        {/* ─── TICKET 2 (White Minimalist Ticket - layered behind) ─── */}
        <g
          ref={(element) => {
            elementsRef.current["ticket-2"] = element;
          }}
          transform="translate(250, 320) rotate(16)"
        >
          <rect
            x="-130"
            y="-75"
            width="260"
            height="150"
            rx="14"
            fill="#ffffff"
            fillOpacity="0.04"
            stroke="#ffffff"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
          {/* Ticket 2 Notches */}
          <circle cx="-130" cy="0" r="14" fill="#151515" stroke="#ffffff" strokeWidth="2" />
          <circle cx="130" cy="0" r="14" fill="#151515" stroke="#ffffff" strokeWidth="2" />
          {/* Minimal Perforation */}
          <line
            x1="45"
            y1="-75"
            x2="45"
            y2="75"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.6"
            strokeDasharray="4 4"
          />
        </g>

        {/* ─── TICKET 1 (Primary Gold Geometric Ticket) ─── */}
        <g
          ref={(element) => {
            elementsRef.current["ticket-1"] = element;
          }}
          transform="translate(260, 310) rotate(-14)"
        >
          {/* Ticket Base Outline & Subtle Gold Fill */}
          <rect
            x="-140"
            y="-85"
            width="280"
            height="170"
            rx="16"
            fill="#ffcc4d"
            fillOpacity="0.12"
            stroke="#ffcc4d"
            strokeWidth="3"
          />

          {/* Ticket Edge Notches */}
          <circle cx="-140" cy="0" r="16" fill="#151515" stroke="#ffcc4d" strokeWidth="3" />
          <circle cx="140" cy="0" r="16" fill="#151515" stroke="#ffcc4d" strokeWidth="3" />

          {/* Perforated Stub Tear-Line */}
          <line
            x1="-35"
            y1="-85"
            x2="-35"
            y2="85"
            stroke="#ffcc4d"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />

          {/* Abstract Ticket Blocks */}
          <rect x="-115" y="-60" width="60" height="8" rx="2" fill="#ffcc4d" />
          <rect x="-115" y="-42" width="40" height="4" rx="2" fill="#ffffff" fillOpacity="0.8" />
          <rect x="-115" y="-28" width="50" height="4" rx="2" fill="#ffffff" fillOpacity="0.6" />

          {/* Cinema Admit Pass Stamp: LOGIN NOW */}
          <g transform="translate(-85, 12)">
            <rect
              x="-46"
              y="-13"
              width="92"
              height="26"
              rx="5"
              fill="#151515"
              stroke="#ffcc4d"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <text
              x="0"
              y="4.5"
              textAnchor="middle"
              fill="#ffcc4d"
              fontSize="9"
              fontWeight="900"
              letterSpacing="2.5"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            >
              LOGIN NOW
            </text>
          </g>

          {/* Abstract Barcode Lines on the Right Stub */}
          <g transform="translate(0, -50)">
            <line x1="0" y1="0" x2="0" y2="100" stroke="#ffcc4d" strokeWidth="3" />
            <line
              x1="8"
              y1="0"
              x2="8"
              y2="100"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
            <line x1="16" y1="0" x2="16" y2="100" stroke="#ffcc4d" strokeWidth="4" />
            <line
              x1="26"
              y1="0"
              x2="26"
              y2="100"
              stroke="#ffffff"
              strokeWidth="2"
              strokeOpacity="0.9"
            />
            <line x1="34" y1="0" x2="34" y2="100" stroke="#ffcc4d" strokeWidth="1.5" />
            <line
              x1="42"
              y1="0"
              x2="42"
              y2="100"
              stroke="#ffffff"
              strokeWidth="3"
              strokeOpacity="0.9"
            />
            <line x1="52" y1="0" x2="52" y2="100" stroke="#ffcc4d" strokeWidth="2" />
            <line
              x1="62"
              y1="0"
              x2="62"
              y2="100"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
            <line x1="72" y1="0" x2="72" y2="100" stroke="#ffcc4d" strokeWidth="4" />
            <line
              x1="82"
              y1="0"
              x2="82"
              y2="100"
              stroke="#ffffff"
              strokeWidth="2"
              strokeOpacity="0.7"
            />
            <line x1="92" y1="0" x2="92" y2="100" stroke="#ffcc4d" strokeWidth="3" />
            <line
              x1="102"
              y1="0"
              x2="102"
              y2="100"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeOpacity="0.9"
            />
          </g>

          {/* Geometric Perforated Corner Dots */}
          <circle cx="-115" cy="55" r="5" fill="#ffcc4d" />
          <circle cx="-95" cy="55" r="5" fill="#ffffff" fillOpacity="0.9" />
          <circle cx="-75" cy="55" r="5" fill="#ffcc4d" fillOpacity="0.6" />
        </g>

        {/* ─── INTERACTIVE POPCORN CLUSTERS ─── */}
        {/* Popcorn Cluster 1 (Top Left, Center ~135, 135) */}
        <g
          ref={(element) => {
            elementsRef.current["popcorn-1"] = element;
          }}
          transform="translate(135, 135)"
        >
          <circle cx="-5" cy="-5" r="14" fill="#ffffff" fillOpacity="0.9" />
          <circle cx="11" cy="-11" r="12" fill="#ffcc4d" />
          <circle cx="5" cy="5" r="13" fill="#ffffff" fillOpacity="0.85" />
          <circle cx="-10" cy="7" r="10" fill="#ffcc4d" fillOpacity="0.9" />
          <path d="M -13 0 Q -1 6 7 -4" stroke="#151515" strokeWidth="2.5" fill="none" />
        </g>

        {/* Popcorn Cluster 2 (Top Right, Center ~365, 115) */}
        <g
          ref={(element) => {
            elementsRef.current["popcorn-2"] = element;
          }}
          transform="translate(365, 115)"
        >
          <circle cx="-5" cy="-5" r="16" fill="#ffcc4d" />
          <circle cx="14" cy="-7" r="14" fill="#ffffff" fillOpacity="0.95" />
          <circle cx="5" cy="9" r="15" fill="#ffcc4d" fillOpacity="0.9" />
          <circle cx="-14" cy="7" r="11" fill="#ffffff" fillOpacity="0.8" />
          <path d="M -12 -3 Q 0 2 10 -5" stroke="#151515" strokeWidth="2.5" fill="none" />
        </g>

        {/* Popcorn Cluster 3 (Left Mid, Center ~85, 280) */}
        <g
          ref={(element) => {
            elementsRef.current["popcorn-3"] = element;
          }}
          transform="translate(85, 280)"
        >
          <circle cx="-2" cy="-6" r="12" fill="#ffffff" fillOpacity="0.85" />
          <circle cx="10" cy="0" r="13" fill="#ffcc4d" />
          <circle cx="-2" cy="8" r="10" fill="#ffffff" fillOpacity="0.7" />
        </g>

        {/* Popcorn Cluster 4 (Right Mid, Center ~410, 250) */}
        <g
          ref={(element) => {
            elementsRef.current["popcorn-4"] = element;
          }}
          transform="translate(410, 250)"
        >
          <circle cx="-8" cy="-3" r="14" fill="#ffcc4d" />
          <circle cx="8" cy="-9" r="13" fill="#ffffff" fillOpacity="0.9" />
          <circle cx="2" cy="9" r="14" fill="#ffffff" fillOpacity="0.8" />
          <circle cx="-14" cy="7" r="11" fill="#ffcc4d" fillOpacity="0.85" />
          <path d="M -14 -3 Q -4 3 6 -5" stroke="#151515" strokeWidth="2.5" fill="none" />
        </g>

        {/* Popcorn Burst 5 (Bottom Center, Center ~250, 485) */}
        <g
          ref={(element) => {
            elementsRef.current["popcorn-5"] = element;
          }}
          transform="translate(250, 485)"
        >
          <circle cx="-12" cy="-8" r="15" fill="#ffffff" fillOpacity="0.9" />
          <circle cx="6" cy="-13" r="13" fill="#ffcc4d" />
          <circle cx="-2" cy="4" r="14" fill="#ffffff" fillOpacity="0.8" />
          <circle cx="-20" cy="2" r="10" fill="#ffcc4d" fillOpacity="0.9" />
        </g>

        {/* Ambient Subtle Sparkle Embers (Tiny Floating Specks) */}
        <circle cx="180" cy="70" r="4" fill="#ffcc4d" />
        <circle cx="210" cy="85" r="3" fill="#ffffff" />
        <circle cx="310" cy="65" r="3.5" fill="#ffcc4d" />
        <circle cx="450" cy="180" r="4" fill="#ffffff" fillOpacity="0.9" />
        <circle cx="425" cy="320" r="3" fill="#ffcc4d" />
        <circle cx="85" cy="210" r="3.5" fill="#ffffff" />
        <circle cx="115" cy="400" r="4" fill="#ffcc4d" />
        <circle cx="370" cy="460" r="3" fill="#ffffff" />
      </svg>
    </div>
  );
}
