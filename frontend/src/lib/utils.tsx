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
      "An error occurred while fetching the data.",
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

// Capitalize the first letter of a string
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatDateToMMDDYYYY(dateString: string) {
  const date = new Date(dateString); // Create a Date object
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0"); // Day of the month
  const year = date.getFullYear(); // Full year

  return `${month}/${day}/${year}`;
}

export function redirectToAdmin() {
  if (typeof window !== "undefined") {
    // This will only run on the client-side
    window.location.href = "http://localhost:3001/admin";
  }
}

export function deepEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function getFullUrl(imageId: number | undefined): string {
  console.log("http://localhost:2283/photos/" + imageId);
  return "http://localhost:2283/photos/" + imageId;
}
