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
  // Disconnected Ticket Half A (Top Left Half)
  {
    id: "ticket-half-a",
    baseX: 230,
    baseY: 285,
    baseRot: -18,
    radius: 170,
    maxPush: 40,
    freq: 1.2,
    amplitude: 7,
    rotAmplitude: 2,
    phase: 0.3,
  },
  // Disconnected Ticket Half B (Bottom Right Half, offset glitch gap)
  {
    id: "ticket-half-b",
    baseX: 295,
    baseY: 345,
    baseRot: -12,
    radius: 170,
    maxPush: 40,
    freq: 1.0,
    amplitude: 6,
    rotAmplitude: -2,
    phase: 2.5,
  },
  // Interrupted Spool Reel Hub (Top Right)
  {
    id: "reel-hub",
    baseX: 370,
    baseY: 130,
    baseRot: 0,
    radius: 150,
    maxPush: 50,
    freq: 1.4,
    amplitude: 8,
    rotAmplitude: 4,
    phase: 1.2,
  },
  // Glitch Spark Cluster 1 (Top Left)
  {
    id: "spark-1",
    baseX: 115,
    baseY: 130,
    baseRot: 0,
    radius: 130,
    maxPush: 55,
    freq: 1.7,
    amplitude: 9,
    rotAmplitude: 3,
    phase: 0.8,
  },
  // Glitch Spark Cluster 2 (Left Mid)
  {
    id: "spark-2",
    baseX: 85,
    baseY: 340,
    baseRot: 0,
    radius: 130,
    maxPush: 50,
    freq: 1.5,
    amplitude: 8,
    rotAmplitude: -3,
    phase: 3.4,
  },
  // Glitch Spark Cluster 3 (Bottom Center)
  {
    id: "spark-3",
    baseX: 260,
    baseY: 490,
    baseRot: 0,
    radius: 150,
    maxPush: 50,
    freq: 1.6,
    amplitude: 8,
    rotAmplitude: 2.5,
    phase: 4.1,
  },
];

/**
 * Interactive Abstract Cinema Error Artwork for RouteError.
 * - Infused with cinema alarm red (#ef4444 / #dc2626), gold (#ffcc4d), and white (#ffffff) on dark canvas (#151515).
 * - Theme: Interrupted signal, split ticket with glowing red fracture seam, disconnected film tape, red warning embers.
 * - Organic zero-gravity floating motion on all fragments.
 * - Cursor repulsion physics: elements smoothly dodge away from mouse and spring back.
 * - Completely free of text.
 */
export default function RouteErrorArt() {
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

        // Spring damping
        item.currentX += (item.targetX - item.currentX) * 0.12;
        item.currentY += (item.targetY - item.currentY) * 0.12;

        // Zero-gravity floating wave
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
        <circle cx="260" cy="300" r="140" fill="#ef4444" fillOpacity="0.06" />

        <g stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1.5">
          <circle cx="260" cy="300" r="240" strokeDasharray="6 8" />
          <circle cx="260" cy="300" r="180" strokeDasharray="12 6" />
          <circle
            cx="260"
            cy="300"
            r="120"
            strokeDasharray="4 6"
            stroke="#ef4444"
            strokeOpacity="0.2"
          />
          <circle
            cx="260"
            cy="300"
            r="60"
            strokeDasharray="8 4"
            stroke="#ef4444"
            strokeOpacity="0.3"
          />
          <line x1="20" y1="300" x2="500" y2="300" strokeDasharray="8 6" />
          <line x1="260" y1="60" x2="260" y2="540" strokeDasharray="8 6" />
        </g>

        <line
          x1="60"
          y1="520"
          x2="460"
          y2="80"
          stroke="#ef4444"
          strokeOpacity="0.35"
          strokeWidth="2.5"
          strokeDasharray="16 8"
        />
        <line
          x1="80"
          y1="540"
          x2="480"
          y2="100"
          stroke="#ffcc4d"
          strokeOpacity="0.2"
          strokeWidth="1.5"
          strokeDasharray="8 8"
        />

        <path
          d="M 120 180 C 180 140, 260 200, 320 170 C 380 140, 420 180, 410 240 C 400 300, 310 320, 240 370 C 170 420, 150 480, 220 520"
          stroke="#ef4444"
          strokeWidth="3"
          strokeDasharray="8 6"
          strokeOpacity="0.45"
          fill="none"
        />

        <g
          ref={(element) => {
            elementsRef.current["ticket-half-a"] = element;
          }}
          transform="translate(230, 285) rotate(-18)"
        >
          <path
            d="M -130 -80 L 10 -80 L -15 80 L -130 80 Q -145 80 -145 65 L -145 15 Q -130 15 -130 0 Q -130 -15 -145 -15 L -145 -65 Q -145 -80 -130 -80 Z"
            fill="#ef4444"
            fillOpacity="0.12"
            stroke="#ef4444"
            strokeWidth="3"
          />
          <line
            x1="-35"
            y1="-80"
            x2="-35"
            y2="80"
            stroke="#ffcc4d"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />
          <rect x="-115" y="-55" width="50" height="8" rx="2" fill="#ef4444" />
          <rect x="-115" y="-38" width="35" height="4" rx="2" fill="#ffffff" fillOpacity="0.8" />
          <rect x="-115" y="-24" width="45" height="4" rx="2" fill="#ffcc4d" fillOpacity="0.8" />

          <g transform="translate(-80, 12)">
            <rect
              x="-56"
              y="-13"
              width="112"
              height="26"
              rx="5"
              fill="#151515"
              stroke="#ef4444"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            <text
              x="0"
              y="4.5"
              textAnchor="middle"
              fill="#ef4444"
              fontSize="6.8"
              fontWeight="900"
              letterSpacing="1.2"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            >
              PLEASE TRY AGAIN LATER
            </text>
          </g>
          <circle cx="-115" cy="50" r="5" fill="#ef4444" />
          <circle cx="-95" cy="50" r="5" fill="#ffffff" fillOpacity="0.9" />
        </g>

        <g
          ref={(element) => {
            elementsRef.current["ticket-half-b"] = element;
          }}
          transform="translate(295, 345) rotate(-12)"
        >
          <path
            d="M -15 -80 L 130 -80 Q 145 -80 145 -65 L 145 -15 Q 130 -15 130 0 Q 130 15 145 15 L 145 65 Q 145 80 130 80 L -40 80 Z"
            fill="#ffffff"
            fillOpacity="0.06"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeDasharray="10 4"
          />
          <line
            x1="-15"
            y1="-80"
            x2="-40"
            y2="80"
            stroke="#ef4444"
            strokeWidth="3"
            strokeDasharray="4 4"
          />

          <g transform="translate(0, -50)">
            <line x1="0" y1="0" x2="0" y2="90" stroke="#ef4444" strokeWidth="3" />
            <line
              x1="10"
              y1="0"
              x2="10"
              y2="90"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
            <line x1="20" y1="0" x2="20" y2="90" stroke="#ffcc4d" strokeWidth="4" />
            <line
              x1="32"
              y1="0"
              x2="32"
              y2="90"
              stroke="#ef4444"
              strokeWidth="2"
              strokeOpacity="0.9"
            />
            <line x1="42" y1="0" x2="42" y2="90" stroke="#ffcc4d" strokeWidth="1.5" />
            <line
              x1="54"
              y1="0"
              x2="54"
              y2="90"
              stroke="#ffffff"
              strokeWidth="3"
              strokeOpacity="0.8"
            />
            <line x1="68" y1="0" x2="68" y2="90" stroke="#ef4444" strokeWidth="3.5" />
            <line
              x1="80"
              y1="0"
              x2="80"
              y2="90"
              stroke="#ffffff"
              strokeWidth="2"
              strokeOpacity="0.7"
            />
          </g>
          <circle cx="50" cy="50" r="5" fill="#ef4444" />
          <circle cx="70" cy="50" r="5" fill="#ffffff" fillOpacity="0.8" />
        </g>

        <g
          ref={(element) => {
            elementsRef.current["reel-hub"] = element;
          }}
          transform="translate(370, 130)"
        >
          <circle cx="0" cy="0" r="48" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="8 4" />
          <circle
            cx="0"
            cy="0"
            r="26"
            fill="#ef4444"
            fillOpacity="0.15"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <circle cx="0" cy="0" r="10" fill="#151515" stroke="#ef4444" strokeWidth="2" />
          <circle cx="0" cy="-17" r="5" fill="#151515" stroke="#ef4444" strokeWidth="1.5" />
          <circle cx="15" cy="9" r="5" fill="#151515" stroke="#ef4444" strokeWidth="1.5" />
          <circle cx="-15" cy="9" r="5" fill="#151515" stroke="#ef4444" strokeWidth="1.5" />
        </g>

        <g
          ref={(element) => {
            elementsRef.current["spark-1"] = element;
          }}
          transform="translate(115, 130)"
        >
          <circle cx="0" cy="0" r="14" fill="#ef4444" fillOpacity="0.9" />
          <circle cx="16" cy="-6" r="11" fill="#ffcc4d" />
          <circle cx="10" cy="10" r="12" fill="#ffffff" fillOpacity="0.85" />
          <circle cx="-5" cy="12" r="9" fill="#ef4444" fillOpacity="0.85" />
        </g>

        <g
          ref={(element) => {
            elementsRef.current["spark-2"] = element;
          }}
          transform="translate(85, 340)"
        >
          <circle cx="0" cy="0" r="12" fill="#ef4444" />
          <circle cx="14" cy="4" r="11" fill="#ffffff" fillOpacity="0.9" />
          <circle cx="2" cy="14" r="10" fill="#ffcc4d" fillOpacity="0.85" />
        </g>

        <g
          ref={(element) => {
            elementsRef.current["spark-3"] = element;
          }}
          transform="translate(260, 490)"
        >
          <circle cx="0" cy="0" r="15" fill="#ef4444" fillOpacity="0.95" />
          <circle cx="18" cy="-5" r="13" fill="#ffcc4d" />
          <circle cx="10" cy="12" r="14" fill="#ffffff" fillOpacity="0.8" />
          <circle cx="-8" cy="10" r="10" fill="#ef4444" fillOpacity="0.9" />
        </g>

        <circle cx="190" cy="90" r="4.5" fill="#ef4444" />
        <circle cx="220" cy="105" r="3" fill="#ffffff" />
        <circle cx="310" cy="85" r="3.5" fill="#ffcc4d" />
        <circle cx="440" cy="200" r="4.5" fill="#ef4444" fillOpacity="0.9" />
        <circle cx="425" cy="330" r="3" fill="#ffcc4d" />
        <circle cx="115" cy="410" r="4" fill="#ef4444" />
        <circle cx="380" cy="470" r="3" fill="#ffffff" />
      </svg>
    </div>
  );
}
