import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useStore } from '../../store/useStore';

export function HeroOverlay() {
  const isLoaded = useStore((s) => s.isLoaded);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const tl = gsap.timeline({ delay: 0.3 });

    // Animate each character of "AIRIS"
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.char');
      tl.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'expo.out',
      });
    }

    // Subtitle
    tl.to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'expo.out',
    }, '-=0.3');

    // Tagline
    tl.to(taglineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'expo.out',
    }, '-=0.4');

    // Scroll CTA
    tl.to(ctaRef.current, {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
    }, '-=0.2');

    return () => {
      tl.kill();
    };
  }, [isLoaded]);

  if (!isLoaded) return null;

  const titleChars = 'AIRIS'.split('');

  return (
    <div className="hero-section content-layer">
      <h1 ref={titleRef} className="hero-title text-glow">
        {titleChars.map((char, i) => (
          <span key={i} className="char text-gradient">
            {char}
          </span>
        ))}
      </h1>

      <p
        ref={subtitleRef}
        className="hero-subtitle"
        style={{ opacity: 0, transform: 'translateY(30px)' }}
      >
        The Universe of Artificial Intelligence
      </p>

      <p
        ref={taglineRef}
        className="hero-tagline"
        style={{ opacity: 0, transform: 'translateY(20px)' }}
      >
        From curiosity to the frontier
      </p>

      <div ref={ctaRef} className="hero-scroll-cta" style={{ opacity: 0 }}>
        <span>Begin your journey</span>
        <div className="scroll-indicator" />
      </div>
    </div>
  );
}
