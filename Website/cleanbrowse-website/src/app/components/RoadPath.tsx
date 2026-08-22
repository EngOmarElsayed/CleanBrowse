"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Draws a smooth winding "road" through every sibling element marked with
 * data-road-point, as two SVG strokes: asphalt + dashed lane marking.
 * Recomputes on resize so the curve always passes through the checkpoints.
 */
export default function RoadPath() {
  const ref = useRef<HTMLDivElement>(null);
  const [d, setD] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;

    function compute() {
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const pts = [...host.querySelectorAll<HTMLElement>("[data-road-point]")].map(
        (el) => {
          const r = el.getBoundingClientRect();
          return {
            x: r.left + r.width / 2 - rect.left,
            y: r.top + r.height / 2 - rect.top,
          };
        }
      );
      if (pts.length < 2) return;

      // Catmull-Rom spline converted to cubic beziers for a smooth road
      let path = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] ?? pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] ?? p2;
        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;
        path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
      }
      setD(path);
      setSize({ w: rect.width, h: rect.height });
    }

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(host);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 pointer-events-none">
      {d && (
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="none"
          className="absolute inset-0 overflow-visible"
        >
          <path d={d} fill="none" stroke="#0d2015" strokeWidth="16" strokeLinecap="round" />
          <path
            d={d}
            fill="none"
            stroke="rgba(246,247,242,0.75)"
            strokeWidth="3"
            strokeDasharray="10 15"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}
