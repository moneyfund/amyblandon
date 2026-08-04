import { useEffect, useRef, useState } from 'react';

export default function RevealOnScroll({ as: Tag = 'div', className = '', direction = 'up', delay = 0, duration = 650, children, ...props }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { setVisible(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.18, rootMargin: '0px 0px -40px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <Tag ref={ref} className={`reveal reveal--${direction} ${visible ? 'is-visible' : ''} ${className}`} style={{ '--reveal-delay': `${delay}ms`, '--reveal-duration': `${duration}ms` }} {...props}>{children}</Tag>;
}
