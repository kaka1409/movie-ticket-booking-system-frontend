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
  // Popcorn Kernel 1 (Top Left)
  {
    id: "popcorn-1",
    baseX: 120,
    baseY: 130,
    baseRot: 0,
    radius: 140,
    maxPush: 55,
    freq: 1.7,
    amplitude: 9,
    rotAmplitude: 3,
    phase: 0.3,
  },
  // Popcorn Kernel 2 (Top Right)
  {
    id: "popcorn-2",
    baseX: 380,
    baseY: 120,
    baseRot: 0,
    radius: 140,
    maxPush: 55,
    freq: 1.4,
    amplitude: 10,
    rotAmplitude: -3,
    phase: 1.9,
  },
  // Popcorn Kernel 3 (Mid Left)
  {
    id: "popcorn-3",
    baseX: 80,
    baseY: 300,
    baseRot: 0,
    radius: 125,
    maxPush: 45,
    freq: 1.6,
    amplitude: 8,
    rotAmplitude: 2.5,
    phase: 3.1,
  },
  // Popcorn Kernel 4 (Mid Right)
  {
    id: "popcorn-4",
    baseX: 415,
    baseY: 270,
    baseRot: 0,
    radius: 130,
    maxPush: 50,
    freq: 1.8,
    amplitude: 9,
    rotAmplitude: -2.5,
    phase: 4.4,
  },
  // Popcorn Cluster 5 (Bottom)
  {
    id: "popcorn-5",
    baseX: 250,
    baseY: 490,
    baseRot: 0,
    radius: 150,
    maxPush: 50,
    freq: 1.3,
    amplitude: 8,
    rotAmplitude: 3,
    phase: 2.5,
  },
  // Abstract Floating Empty-Aperture Ticket
  {
    id: "ticket-empty",
    baseX: 245,
    baseY: 325,
    baseRot: -11,
    radius: 180,
    maxPush: 36,
    freq: 1.1,
    amplitude: 6,
    rotAmplitude: 1.5,
    phase: 0.6,
  },
  // Floating Film Ribbon / Cassette Strip
  {
    id: "film-ribbon",
    baseX: 260,
    baseY: 335,
    baseRot: 14,
    radius: 170,
    maxPush: 30,
    freq: 0.95,
    amplitude: 5.5,
    rotAmplitude: -1.8,
    phase: 3.6,
  },
  // Projector Film Reel Hub
  {
    id: "spool-hub",
    baseX: 250,
    baseY: 165,
    baseRot: 0,
    radius: 155,
    maxPush: 30,
    freq: 1.2,
    amplitude: 6,
    rotAmplitude: 2,
    phase: 1.2,
  },
];

/**
 * Interactive Abstract Cinema Artwork for 404 (Not Found).
 * - Represents "Lost outside the frame": projector light cone, floating film spool,
 *   empty aperture ticket frame, drifting film strip, and zero-gravity popcorn.
 * - Strictly uses Gold (#ffcc4d) and White (#ffffff) on dark canvas (#151515).
 * - Zero text, no letters, no numbers, no corner crop marks.
 * - Organic zero-gravity floating oscillation + interactive mouse repulsion physics.
 */
export default function NotFoundArt() {
  const containerReference = useRef<HTMLDivElement>(null);
  const elementsReference = useRef<Record<string, SVGGElement | null>>({});
  const itemsReference = useRef<InteractiveItem[]>(
    ITEMS_CONFIG.map((item) => ({
      ...item,
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
    })),
  );
  const mouseReference = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      const mouse = mouseReference.current;
      const time = performance.now() * 0.001;

      itemsReference.current.forEach((item) => {
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

        // Damped spring return
        item.currentX += (item.targetX - item.currentX) * 0.12;
        item.currentY += (item.targetY - item.currentY) * 0.12;

        // Mathematical zero-gravity wave motion
        const floatY = Math.sin(time * item.freq + item.phase) * item.amplitude;
        const floatX = Math.cos(time * (item.freq * 0.7) + item.phase) * (item.amplitude * 0.35);
        const floatRot = Math.sin(time * item.freq + item.phase) * item.rotAmplitude;

        const positionX = item.baseX + item.currentX + floatX;
        const positionY = item.baseY + item.currentY + floatY;
        const rotation = item.baseRot + floatRot;

        const node = elementsReference.current[item.id];
        if (node) {
          node.setAttribute(
            "transform",
            `translate(${positionX.toFixed(2)}, ${positionY.toFixed(2)}) rotate(${rotation.toFixed(2)})`,
          );
        }
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerReference.current) return;
    const bounds = containerReference.current.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;
    mouseReference.current = {
      x: relativeX * 500,
      y: relativeY * 620,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseReference.current.active = false;
  };

  return (
    <div
      ref={containerReference}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-full min-h-[580px] w-full items-center justify-center overflow-hidden bg-[#151515] p-6 select-none lg:min-h-[640px] lg:p-10"
      aria-hidden="true"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,204,77,0.08),transparent_70%)]" />

      {/* SVG Canvas (500x620) */}
      <svg
        viewBox="0 0 500 620"
        className="relative h-full max-h-[560px] w-full max-w-[460px] overflow-visible"
      >
        <defs>
          {/* Subtle Projector Cone Gradient */}
          <linearGradient id="nf-projector-beam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="30%" stopColor="#ffcc4d" stopOpacity="0.08" />
            <stop offset="85%" stopColor="#ffcc4d" stopOpacity="0.015" />
            <stop offset="100%" stopColor="#ffcc4d" stopOpacity="0" />
          </linearGradient>

          {/* Ticket Gradient Gold */}
          <linearGradient id="nf-ticket-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#252420" />
            <stop offset="50%" stopColor="#1e1d1a" />
            <stop offset="100%" stopColor="#161513" />
          </linearGradient>

          {/* Ticket Gradient White */}
          <linearGradient id="nf-ticket-white" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a2927" />
            <stop offset="100%" stopColor="#191919" />
          </linearGradient>

          {/* Popcorn Butter Gold Gradient */}
          <linearGradient id="nf-popcorn-gold" x1="30%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#fff8e1" />
            <stop offset="45%" stopColor="#ffcc4d" />
            <stop offset="100%" stopColor="#e5a920" />
          </linearGradient>

          {/* Popcorn Crisp White Gradient */}
          <linearGradient id="nf-popcorn-white" x1="20%" y1="15%" x2="85%" y2="85%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f5f0e6" />
            <stop offset="100%" stopColor="#ded7c8" />
          </linearGradient>

          {/* Perforated Hole Mask */}
          <pattern id="nf-sprocket-pattern" width="12" height="12" patternUnits="userSpaceOnUse">
            <rect x="2" y="2" width="8" height="8" rx="2" fill="#ffcc4d" opacity="0.35" />
          </pattern>
        </defs>

        {/* ─── STATIC BACKGROUND: Atmospheric Projector Beam ─── */}
        <g opacity="0.85">
          {/* Projector Origin Aperture */}
          <ellipse cx="250" cy="40" rx="36" ry="6" fill="#ffffff" opacity="0.3" />
          <ellipse cx="250" cy="40" rx="20" ry="3.5" fill="#ffcc4d" opacity="0.6" />
          {/* Conical Light Beam */}
          <polygon points="230,40 270,40 430,560 70,560" fill="url(#nf-projector-beam)" />
          {/* Dust orbs glistening inside beam */}
          <circle cx="210" cy="180" r="1.5" fill="#ffffff" opacity="0.4" />
          <circle cx="290" cy="220" r="2" fill="#ffcc4d" opacity="0.45" />
          <circle cx="180" cy="310" r="1.5" fill="#ffffff" opacity="0.35" />
          <circle cx="320" cy="370" r="2.5" fill="#ffcc4d" opacity="0.5" />
          <circle cx="230" cy="440" r="1.8" fill="#ffffff" opacity="0.4" />
        </g>

        {/* ─── DYNAMIC ITEM: Film Spool Hub (Rotating/Floating) ─── */}
        <g
          ref={(element) => {
            elementsReference.current["spool-hub"] = element;
          }}
          className="cursor-pointer"
        >
          {/* Outer Spool Rings */}
          <circle
            cx="0"
            cy="0"
            r="54"
            fill="none"
            stroke="#ffcc4d"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
          <circle
            cx="0"
            cy="0"
            r="46"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeDasharray="3 4"
            strokeOpacity="0.3"
          />
          <circle
            cx="0"
            cy="0"
            r="32"
            fill="#1c1b18"
            stroke="#ffcc4d"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          {/* 3 Spool Cutouts */}
          <circle
            cx="-16"
            cy="-10"
            r="7"
            fill="#151515"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
          <circle
            cx="16"
            cy="-10"
            r="7"
            fill="#151515"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
          <circle
            cx="0"
            cy="18"
            r="7"
            fill="#151515"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
          {/* Spool Center Axle */}
          <circle cx="0" cy="0" r="9" fill="#ffcc4d" opacity="0.8" />
          <circle cx="0" cy="0" r="3" fill="#151515" />
        </g>

        {/* ─── DYNAMIC ITEM: Secondary Curving Film Strip / Ribbon ─── */}
        <g
          ref={(element) => {
            elementsReference.current["film-ribbon"] = element;
          }}
          className="cursor-pointer"
        >
          {/* Curved film strip body */}
          <path
            d="M -110,-75 C -50,-100 50,-50 110,-80 L 115,-30 C 55,0 -45,-50 -105,-25 Z"
            fill="url(#nf-ticket-white)"
            stroke="#ffffff"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          {/* Perforations top & bottom */}
          <line
            x1="-100"
            y1="-70"
            x2="100"
            y2="-75"
            stroke="#ffcc4d"
            strokeWidth="2.5"
            strokeDasharray="4 5"
            strokeOpacity="0.6"
          />
          <line
            x1="-95"
            y1="-30"
            x2="105"
            y2="-35"
            stroke="#ffcc4d"
            strokeWidth="2.5"
            strokeDasharray="4 5"
            strokeOpacity="0.6"
          />
        </g>

        {/* ─── DYNAMIC ITEM: Primary Cinema Ticket (Empty Center Aperture Frame) ─── */}
        <g
          ref={(element) => {
            elementsReference.current["ticket-empty"] = element;
          }}
          className="cursor-pointer"
        >
          {/* Outer Ticket Card with Notches */}
          <path
            d="
              M -95,-130
              L 95,-130
              A 14,14 0 0,0 95,-102
              L 95,102
              A 14,14 0 0,0 95,130
              L -95,130
              A 14,14 0 0,0 -95,102
              L -95,-102
              A 14,14 0 0,0 -95,-130
              Z
            "
            fill="url(#nf-ticket-gold)"
            stroke="#ffcc4d"
            strokeWidth="1.5"
            strokeOpacity="0.75"
          />

          {/* Dotted Perforation Cut Line */}
          <line
            x1="-95"
            y1="-40"
            x2="95"
            y2="-40"
            stroke="#ffcc4d"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            strokeOpacity="0.5"
          />

          {/* Top Ticket Stub Accent: Cinema Projector Arc */}
          <circle
            cx="0"
            cy="-85"
            r="18"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            strokeOpacity="0.35"
          />
          <circle cx="0" cy="-85" r="8" fill="#ffcc4d" opacity="0.6" />
          <line
            x1="-40"
            y1="-85"
            x2="-25"
            y2="-85"
            stroke="#ffcc4d"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
          <line
            x1="25"
            y1="-85"
            x2="40"
            y2="-85"
            stroke="#ffcc4d"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />

          {/* 404 Visual Metaphor: Empty Center Frame Aperture (Looking through to dark space) */}
          <rect
            x="-65"
            y="-15"
            width="130"
            height="115"
            rx="10"
            fill="#151515"
            stroke="#ffcc4d"
            strokeWidth="1"
            strokeDasharray="6 3"
            strokeOpacity="0.6"
          />

          {/* Abstract Empty Frame Crosshair / Aperture Corners */}
          <path
            d="M -55,-5 L -45,-5 M -55,-5 L -55,5"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />
          <path
            d="M 55,-5 L 45,-5 M 55,-5 L 55,5"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />
          <path
            d="M -55,90 L -45,90 M -55,90 L -55,80"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />
          <path
            d="M 55,90 L 45,90 M 55,90 L 55,80"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />

          {/* 404 Typography Integrated Into Cinema Projector Aperture */}
          <g transform="translate(0, 36)">
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="#ffcc4d"
              fontSize="28"
              fontWeight="900"
              letterSpacing="3"
              fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
            >
              404
            </text>
            <text
              x="0"
              y="20"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="7.5"
              fontWeight="800"
              letterSpacing="2.5"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              fillOpacity="0.9"
            >
              PAGE NOT FOUND
            </text>
          </g>

          {/* Side Sprocket Perforations */}
          <circle cx="-80" cy="-10" r="3" fill="#ffcc4d" opacity="0.35" />
          <circle cx="-80" cy="15" r="3" fill="#ffcc4d" opacity="0.35" />
          <circle cx="-80" cy="40" r="3" fill="#ffcc4d" opacity="0.35" />
          <circle cx="-80" cy="65" r="3" fill="#ffcc4d" opacity="0.35" />

          <circle cx="80" cy="-10" r="3" fill="#ffcc4d" opacity="0.35" />
          <circle cx="80" cy="15" r="3" fill="#ffcc4d" opacity="0.35" />
          <circle cx="80" cy="40" r="3" fill="#ffcc4d" opacity="0.35" />
          <circle cx="80" cy="65" r="3" fill="#ffcc4d" opacity="0.35" />
        </g>

        {/* ─── DYNAMIC ITEM: Popcorn Kernel 1 (Top Left) ─── */}
        <g
          ref={(element) => {
            elementsReference.current["popcorn-1"] = element;
          }}
          className="cursor-pointer"
        >
          <path
            d="M -12,-8 C -20,-20 -2,-26 6,-18 C 16,-26 28,-14 20,-4 C 28,6 18,20 6,16 C -4,24 -18,16 -14,6 C -24,4 -22,-6 -12,-8 Z"
            fill="url(#nf-popcorn-gold)"
          />
          <circle cx="-2" cy="-4" r="5" fill="url(#nf-popcorn-white)" opacity="0.9" />
          <circle cx="6" cy="4" r="4.5" fill="url(#nf-popcorn-white)" opacity="0.85" />
        </g>

        {/* ─── DYNAMIC ITEM: Popcorn Kernel 2 (Top Right) ─── */}
        <g
          ref={(element) => {
            elementsReference.current["popcorn-2"] = element;
          }}
          className="cursor-pointer"
        >
          <path
            d="M -14,-6 C -22,-18 -6,-24 4,-16 C 14,-22 26,-12 18,-2 C 26,8 14,22 4,18 C -6,22 -20,14 -16,4 C -24,2 -20,-4 -14,-6 Z"
            fill="url(#nf-popcorn-white)"
          />
          <circle cx="-3" cy="-3" r="6" fill="url(#nf-popcorn-gold)" opacity="0.85" />
          <circle cx="5" cy="5" r="4" fill="#ffffff" opacity="0.9" />
        </g>

        {/* ─── DYNAMIC ITEM: Popcorn Kernel 3 (Mid Left) ─── */}
        <g
          ref={(element) => {
            elementsReference.current["popcorn-3"] = element;
          }}
          className="cursor-pointer"
        >
          <path
            d="M -10,-6 C -16,-16 -2,-20 6,-14 C 14,-18 22,-10 16,-2 C 22,6 12,18 4,14 C -4,18 -16,12 -12,4 C -18,2 -16,-4 -10,-6 Z"
            fill="url(#nf-popcorn-gold)"
          />
          <circle cx="-1" cy="-2" r="4.5" fill="url(#nf-popcorn-white)" opacity="0.9" />
        </g>

        {/* ─── DYNAMIC ITEM: Popcorn Kernel 4 (Mid Right) ─── */}
        <g
          ref={(element) => {
            elementsReference.current["popcorn-4"] = element;
          }}
          className="cursor-pointer"
        >
          <path
            d="M -12,-6 C -18,-18 -4,-22 4,-14 C 14,-20 24,-10 16,-2 C 24,6 14,18 4,14 C -4,18 -16,12 -12,4 C -18,2 -18,-4 -12,-6 Z"
            fill="url(#nf-popcorn-white)"
          />
          <circle cx="2" cy="-2" r="5" fill="url(#nf-popcorn-gold)" opacity="0.8" />
        </g>

        {/* ─── DYNAMIC ITEM: Popcorn Cluster 5 (Bottom) ─── */}
        <g
          ref={(element) => {
            elementsReference.current["popcorn-5"] = element;
          }}
          className="cursor-pointer"
        >
          <path
            d="M -16,-8 C -26,-22 -6,-28 6,-18 C 18,-26 32,-14 22,-2 C 32,8 18,24 6,18 C -6,24 -24,16 -18,4 C -28,2 -24,-6 -16,-8 Z"
            fill="url(#nf-popcorn-gold)"
          />
          <circle cx="-3" cy="-4" r="7" fill="url(#nf-popcorn-white)" opacity="0.95" />
          <circle cx="7" cy="4" r="5.5" fill="url(#nf-popcorn-white)" opacity="0.9" />
          {/* Small companion popped flake */}
          <circle cx="22" cy="-14" r="4" fill="url(#nf-popcorn-white)" opacity="0.75" />
        </g>
      </svg>
    </div>
  );
}
