import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const UPSTASH_REST_URL = 'https://arriving-tadpole-30279.upstash.io';
const UPSTASH_TOKEN = 'AXZHAAIjcDEyZWI5MGE5M2I1Y2Q0NTEwODUxZDcxMzk5YmRjYWZjM3AxMA';
const COUNTER_KEY = 'views';
const LOCAL_STORAGE_KEY = 'visitorCountedDate';
const UPSTASH_INCR_ENDPOINT = `${UPSTASH_REST_URL}/incr/${COUNTER_KEY}`;
const UPSTASH_GET_ENDPOINT = `${UPSTASH_REST_URL}/get/${COUNTER_KEY}`;

export function useVisitorCount(): number | null {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const lastCounted = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (lastCounted !== today) {
      fetch(UPSTASH_INCR_ENDPOINT, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      })
        .then(res => res.json())
        .then(data => setViews(data.result))
        .catch(() => setViews(null));
      localStorage.setItem(LOCAL_STORAGE_KEY, today);
    } else {
      fetch(UPSTASH_GET_ENDPOINT, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      })
        .then(res => res.json())
        .then(data => setViews(data.result))
        .catch(() => setViews(null));
    }
  }, []);

  return views;
} 