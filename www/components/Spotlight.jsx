import React, { useEffect, useRef, useState } from 'react';
import './Spotlight.css';

/**
 * Props:
 * - targetRef: ref to the element to highlight
 * - message: tutorial message to show
 * - placement: 'top' | 'bottom' | 'left' | 'right' (arrow/tooltip position)
 * - onNext: function to call when user clicks next
 * - onClose: function to call to close the spotlight
 */
export default function Spotlight({ targetRef, message, placement = 'bottom', onNext, onClose }) {
  const [coords, setCoords] = useState(null);
  const overlayRef = useRef();

  useEffect(() => {
    if (targetRef && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [targetRef, targetRef?.current]);

  if (!coords) return null;

  return (
    <div className="spotlight-overlay" ref={overlayRef}>
      <div
        className="spotlight-hole"
        style={{
          top: coords.top,
          left: coords.left,
          width: coords.width,
          height: coords.height,
        }}
      />
      <div
        className={`spotlight-tooltip spotlight-tooltip-${placement}`}
        style={{
          top: placement === 'top' ? coords.top - 60 : placement === 'bottom' ? coords.top + coords.height + 16 : coords.top,
          left: placement === 'left' ? coords.left - 260 : placement === 'right' ? coords.left + coords.width + 16 : coords.left + coords.width / 2,
        }}
      >
        <div className="spotlight-arrow" data-placement={placement} />
        <div className="spotlight-message">{message}</div>
        <div className="spotlight-actions">
          {onNext && <button onClick={onNext}>Next</button>}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
