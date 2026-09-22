import { useEffect, useRef, useState } from "react";

export const useGuideFadeIn = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.15 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return {
    ref,
    className: `transition duration-700 ease-out ${
      visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    }`,
  };
};
