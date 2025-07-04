import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data."
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

// Capitalize the first letter of a string
export function capitalizeFirstLetter(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}

export function formatDateToMMDDYYYY(dateString: string) {
  const date = new Date(dateString); // Create a Date object
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0"); // Day of the month
  const year = date.getFullYear(); // Full year

  return `${month}/${day}/${year}`;
}

export function formatDateToShortDateTime(dateString: string) {
  const date = new Date(dateString);

  const month = String(date.getMonth() + 1).padStart(2, "0"); // 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2); // Last two digits

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // 0 becomes 12

  return `${month}/${day}/${year} ${hours}:${minutes}${ampm}`;
}

export function deepEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function fnv1aHash(input: string, prime = 31): number {
  let hash = 0x811c9dc5; // 32-bit FNV offset basis
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    hash *= prime;
  }
  return Math.abs(hash >>> 0); // force unsigned 32-bit
}

export function getRandomColor() {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`;
}

import { getSession } from "next-auth/react";
import { auth } from "@/app/(auth)/auth";

export const getAuthToken = async (): Promise<string | null> => {
  const session = await auth();
  return session?.token ?? null; // or session?.accessToken depending on your config
};
