// components/MovingTextBackground.tsx
"use client";
import React from "react";
import "../../styles/moving-text-background.css"; // We'll define styles separately

const words = ["PHOTOGRAPHY", "CAMERA", "SHUTTER", "LIGHT", "EXPOSURE", "LENS"];

export default function MovingTextBackground() {
  return (
    <div className="moving-text-background">
      {words.map((word, index) => {
        return (
          <div
            key={index}
            className={`moving-row row-${index % 6}`}
            style={{ animationDuration: `${25 + index}s` }}
          >
            {Array(10)
              .fill(word)
              .map((w, i) => (
                <span key={i}>{w}</span>
              ))}
          </div>
        );
      })}
    </div>
  );
}
