import { useRef } from "react";

/**
 * Lightweight mouse-based 3D tilt effect for a card, without extra dependencies.
 * Returns a ref to attach and mouse handlers.
 */
export function useTilt(maxTilt = 10) {
  const ref = useRef<HTMLDivElement | null>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(900px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg) scale3d(1.02,1.02,1.02)`;
  }

  function handleMouseLeave() {
    const node = ref.current;
    if (!node) return;
    node.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }

  return { ref, handleMouseMove, handleMouseLeave };
}
