import { useEffect, useRef, useState } from 'react';
import './cursor.css';

const INTERACTIVE_SELECTOR = 'button, a[href], [role="button"], [data-cursor], input, textarea, select, [contenteditable="true"]';
const MAGNETIC_TYPES = new Set(['button', 'ai', 'card']);

const getCursorDetails = (element) => {
  const label = element.dataset.cursor?.trim();
  const type = element.dataset.cursorType;

  if (element.matches('input, textarea, select, [contenteditable="true"]')) {
    return { state: 'text', label: '' };
  }

  if (type === 'ai') return { state: 'ai', label: label || 'AI Powered' };
  if (type === 'card') return { state: 'card', label: label || 'Open' };
  if (element.matches('button, [role="button"]')) {
    return {
      state: 'button',
      label: label || element.getAttribute('aria-label') || element.textContent.trim().replace(/\s+/g, ' ').slice(0, 24),
    };
  }
  if (element.matches('a[href]')) return { state: 'link', label: label || 'Navigate' };
  if (label) return { state: 'hover', label };
  return { state: 'hover', label: '' };
};

export default function SemanticCursor() {
  const [isEnabled, setIsEnabled] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const animationFrameRef = useRef(null);
  const pointerRef = useRef({ x: -100, y: -100 });
  const dotPositionRef = useRef({ x: -100, y: -100 });
  const ringPositionRef = useRef({ x: -100, y: -100 });
  const magneticOffsetRef = useRef({ x: 0, y: 0 });
  const currentElementRef = useRef(null);

  useEffect(() => {
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateAvailability = () => {
      setIsEnabled(pointerQuery.matches && !motionQuery.matches && navigator.maxTouchPoints === 0);
    };

    updateAvailability();
    pointerQuery.addEventListener('change', updateAvailability);
    motionQuery.addEventListener('change', updateAvailability);

    return () => {
      pointerQuery.removeEventListener('change', updateAvailability);
      motionQuery.removeEventListener('change', updateAvailability);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return undefined;

    const cursor = document.querySelector('.semantic-cursor');
    const root = document.documentElement;
    if (!cursor) return undefined;
    root.classList.add('semantic-cursor-enabled');

    const animate = () => {
      const pointer = pointerRef.current;
      const dot = dotPositionRef.current;
      const ring = ringPositionRef.current;
      const magneticOffset = magneticOffsetRef.current;

      dot.x += (pointer.x - dot.x) * 0.38;
      dot.y += (pointer.y - dot.y) * 0.38;
      const ringTargetX = pointer.x + magneticOffset.x;
      const ringTargetY = pointer.y + magneticOffset.y;
      ring.x += (ringTargetX - ring.x) * 0.24;
      ring.y += (ringTargetY - ring.y) * 0.24;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${ring.x + 19}px, ${ring.y + 18}px, 0)`;
      }

      const isSettled = Math.abs(pointer.x - dot.x) < 0.2
        && Math.abs(pointer.y - dot.y) < 0.2
        && Math.abs(ringTargetX - ring.x) < 0.2
        && Math.abs(ringTargetY - ring.y) < 0.2;

      if (isSettled) {
        animationFrameRef.current = null;
      } else {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const requestAnimation = () => {
      if (animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const handlePointerMove = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      cursor.dataset.visible = 'true';
      requestAnimation();
    };

    const handlePointerOver = (event) => {
      if (!(event.target instanceof Element)) return;

      const element = event.target.closest(INTERACTIVE_SELECTOR);
      if (element === currentElementRef.current) return;
      currentElementRef.current = element;

      if (!element) {
        cursor.dataset.state = 'default';
        cursor.dataset.visible = 'true';
        cursor.dataset.label = '';
        magneticOffsetRef.current = { x: 0, y: 0 };
        requestAnimation();
        return;
      }

      const { state, label } = getCursorDetails(element);
      cursor.dataset.state = state;
      cursor.dataset.label = label;
      if (labelRef.current) {
        labelRef.current.textContent = label;
        labelRef.current.setAttribute('aria-hidden', String(!label));
      }

      if (MAGNETIC_TYPES.has(state)) {
        const bounds = element.getBoundingClientRect();
        magneticOffsetRef.current = {
          x: Math.max(-6, Math.min(6, (bounds.left + bounds.width / 2 - event.clientX) * 0.08)),
          y: Math.max(-6, Math.min(6, (bounds.top + bounds.height / 2 - event.clientY) * 0.08)),
        };
      } else {
        magneticOffsetRef.current = { x: 0, y: 0 };
      }
      cursor.dataset.visible = 'true';
      requestAnimation();
    };

    const handlePointerLeave = () => {
      cursor.dataset.visible = 'false';
      currentElementRef.current = null;
      magneticOffsetRef.current = { x: 0, y: 0 };
      cursor.dataset.state = 'default';
      cursor.dataset.label = '';
      if (labelRef.current) {
        labelRef.current.textContent = '';
        labelRef.current.setAttribute('aria-hidden', 'true');
      }
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerover', handlePointerOver);
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      root.classList.remove('semantic-cursor-enabled');
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerover', handlePointerOver);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className="semantic-cursor" data-state="default" data-visible="false" data-label="" aria-hidden="true">
      <span className="semantic-cursor__dot" ref={dotRef} />
      <span className="semantic-cursor__ring" ref={ringRef} />
      <span className="semantic-cursor__label" ref={labelRef} aria-hidden="true" />
    </div>
  );
}
