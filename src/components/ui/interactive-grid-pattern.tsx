"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [x: number, y: number];
  className?: string;
  squaresClassName?: string;
}

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);
  const [squaresX, squaresY] = squares;

  return (
    <svg
      className={cn("absolute inset-0 h-full w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <pattern
          id="interactive-grid"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${width} 0 L 0 0 0 ${height}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            opacity="0.25"
          />
        </pattern>
      </defs>

      {/* Grid lines */}
      <rect width="100%" height="100%" fill="url(#interactive-grid)" />

      {/* Interactive squares */}
      <g style={{ pointerEvents: "all" }}>
        {Array.from({ length: squaresX * squaresY }).map((_, i) => {
          const col = i % squaresX;
          const row = Math.floor(i / squaresX);
          return (
            <rect
              key={i}
              x={col * width}
              y={row * height}
              width={width}
              height={height}
              className={cn(
                "fill-transparent transition-colors duration-300 cursor-default",
                squaresClassName,
                hoveredSquare === i && "[fill-opacity:1]"
              )}
              onMouseEnter={() => setHoveredSquare(i)}
              onMouseLeave={() => setHoveredSquare(null)}
            />
          );
        })}
      </g>
    </svg>
  );
}