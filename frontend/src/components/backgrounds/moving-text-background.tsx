"use client";
import React, { useEffect, useRef, useState } from "react";
import "../../styles/moving-text-background.css";

const WORD_POOL = [
  "PHOTOGRAPHY",
  "CAMERA",
  "SHUTTER",
  "LIGHT",
  "EXPOSURE",
  "LENS",
  "ISO",
  "APERTURE",
  "FOCUS",
  "SNAP",
  "BOKEH",
  "PORTRAIT",
  "WIDE",
  "ZOOM",
  "MACRO",
  "STUDIO",
  "FILM",
];

function getRandomWords(count: number): string[] {
  const shuffled = [...WORD_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function MovingTextBackground() {
  const [rows, setRows] = useState<string[][] | null>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const newRows = Array.from({ length: 10 }).map(() => {
      const words = getRandomWords(5);
      return Array.from({ length: 20 }, (_, i) => words[i % words.length]);
    });
    console.log("Generated rows:", newRows); // Debug
    setRows(newRows);
  }, []);

  useEffect(() => {
    trackRefs.current.forEach((ref, index) => {
      if (ref) {
        const width = ref.offsetWidth;
        const rowEl = containerRefs.current[index];
        console.log(`row ${rowEl} width: `, width);
        if (rowEl) {
          rowEl.style.setProperty("--scroll-width", `${width}px`);
        }
      }
    });
  }, [rows]);

  if (!rows) return;

  return (
    <div className="moving-text-background">
      {rows.map((words, index) => (
        <div
          key={index}
          className="moving-row"
          style={{
            top: `${(100 / rows.length) * index}%`,
            animationDuration: `${25 + index * 2}s`,
            fontSize: "2rem", // boost visibility
            color: "#ffffff10", // subtle white overlay
          }}
          ref={(el) => {
            containerRefs.current[index] = el;
          }}
        >
          <div
            className="scroll-track"
            ref={(el) => {
              trackRefs.current[index] = el;
            }}
          >
            {words.map((word, i) => (
              <span key={`1-${i}`}>{word}</span>
            ))}
          </div>
          <div className="scroll-track">
            {words.map((word, i) => (
              <span key={`2-${i}`}>{word}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
