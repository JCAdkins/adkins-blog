"use client";
import React, { useEffect, useRef, useState } from "react";
import { getRandomColor } from "@/lib/utils";
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
  "F-STOP",
  "COMPOSITION",
  "ASPECT RATIO",
  "BRACKETING",
  "BULB",
  "FLASH",
];

function getRandomWords(count: number): string[] {
  const shuffled = [...WORD_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function MovingTextBackground() {
  const [rows, setRows] = useState<string[][] | null>(null);
  const [directions, setDirections] = useState<boolean[]>([]);
  const fontClasses = ["pacifico", "caveat", "Nunito"];

  useEffect(() => {
    const newRows = Array.from({ length: 10 }).map(() => {
      const words = getRandomWords(5);
      return Array.from({ length: 20 }, (_, i) => words[i % words.length]);
    });
    console.log("Generated rows:", newRows); // Debug
    setRows(newRows);
    const dirs = Array.from({ length: 10 }).map(() => Math.random() > 0.5);
    setDirections(dirs);
  }, []);

  if (!rows) return null;

  return (
    <div className="moving-text-background">
      {rows.map((words, index) => {
        return (
          <div
            key={index}
            className="moving-row"
            style={{
              top: `${(100 / rows.length) * index}%`,
              animationDuration: `${Math.floor(Math.random() * (13 - 9 + 1)) + 9}s`,
              animationName: `${directions[index] ? "shift-left-right" : "shift-right-left"}`,
              fontSize: "2rem",
              color: "#ffffff10",
            }}
          >
            <div className="scroll-track">
              {words.map((word, i) => (
                <span
                  key={`1-${i}`}
                  style={{
                    fontFamily: `var(--font-${fontClasses[Math.floor(Math.random() * fontClasses.length)].toLowerCase()})`,
                  }}
                >
                  <p /*style={{ color: `${getRandomColor()}` }}*/> {word} </p>
                </span>
              ))}
            </div>
            <div className="scroll-track">
              {words.map((word, i) => (
                <span
                  key={`2-${i}`}
                  style={{
                    fontFamily: `var(--font-${fontClasses[Math.floor(Math.random() * fontClasses.length)].toLowerCase()})`,
                  }}
                >
                  <p /*style={{ color: `${getRandomColor()}` }}*/>{word}</p>
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
