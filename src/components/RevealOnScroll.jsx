import { useEffect, useRef, useState } from "react";

/*
  Shared with Home.jsx's local implementation — extracted here so
  Dashboard, LocalExperiences and Safety can reuse the same
  fade-and-slide-up reveal without duplicating the hook in three files.
*/

export default function RevealOnScroll({ children, className = "", style }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={style}
      className={`
        transition-all
        duration-1000
        ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
