import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function useHoverAnimation() {
  const containerRef = useRef();
  const hoverBgRef = useRef();

  const { contextSafe } = useGSAP({ scope: containerRef });

  const toggleHover = contextSafe((isEntering) => {
    gsap.to(hoverBgRef.current, {
      height: isEntering ? "100%" : "0%",
      duration: 0.3,
      ease: "power2.inOut",
    });
  });

  return { containerRef, hoverBgRef, toggleHover };
}
