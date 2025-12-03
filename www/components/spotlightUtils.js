// Utility to get a ref to a DOM element by selector or id
import { useRef, useEffect } from 'react';

export function useSpotlightRef(selector) {
  const ref = useRef(null);
  useEffect(() => {
    if (!selector) return;
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (el) ref.current = el;
  }, [selector]);
  return ref;
}
