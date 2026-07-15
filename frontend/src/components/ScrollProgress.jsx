import { useEffect, useRef, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const rafId = useRef(0);

  useEffect(() => {
    const update = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span
        style={{ width: `${progress}%` }}
        role="none"
      />
    </div>
  );
}
