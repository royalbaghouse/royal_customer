"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Slide = {
  _id: string;
  imageUrl: string;
  alt: string;
  href?: string;
};

type SliderImage = {
  image: string;
  url: string;
};

let cachedSlides: Slide[] | null = null;

export default function BannerSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (cachedSlides) {
      setSlides(cachedSlides);
      setIsLoading(false);
      return;
    }
    
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/settings`)
      .then(res => res.json())
      .then(data => {
        const sliderImages = data?.data?.sliderImages || [];
        const newSlides = sliderImages
          .filter((item: SliderImage) => item.image)
          .map((item: SliderImage, index: number) => ({
            _id: `slide-${index}`,
            imageUrl: item.image,
            alt: `Banner ${index + 1}`,
            href: item.url && item.url.trim() !== '' ? item.url : undefined
          }));
        
        cachedSlides = newSlides;
        setSlides(newSlides);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animationState, setAnimationState] = useState<"in" | "out" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [prefersReducedMotion, setPRM] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPRM(mq.matches);

    const onChange = () => setPRM(mq.matches);

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
    } else if (typeof mq.addListener === "function") {
      mq.addListener(onChange);
    }

    return () => {
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", onChange);
      } else if (typeof mq.removeListener === "function") {
        mq.removeListener(onChange);
      }
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || paused || slides.length <= 1) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setAnimationState("out");
      setTimeout(() => {
        setIdx((p) => (p + 1) % slides.length);
        setAnimationState("in");
      }, 500);
    }, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [prefersReducedMotion, paused, slides.length]);

  useEffect(() => {
    const onBlur = () => setPaused(true);
    const onFocus = () => setPaused(false);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  if (!isLoading && slides.length === 0) {
    return null;
  }

  return (
    <div
      className="relative mx-auto w-full lg:w-[1000px] h-44 sm:h-56 md:h-64 lg:h-80 xl:h-96 rounded-lg overflow-hidden border"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style jsx>{`
        @keyframes flipIn {
          0% {
            transform: translateX(100%) rotateY(90deg);
            opacity: 0;
          }
          100% {
            transform: translateX(0) rotateY(0deg);
            opacity: 1;
          }
        }
        @keyframes flipOut {
          0% {
            transform: translateX(0) rotateY(0deg);
            opacity: 1;
          }
          100% {
            transform: translateX(-100%) rotateY(-90deg);
            opacity: 0;
          }
        }
        .slide-in {
          animation: flipIn 0.5s ease-out forwards;
        }
        .slide-out {
          animation: flipOut 0.5s ease-out forwards;
        }
      `}</style>

      {isLoading && <div className="absolute inset-0 animate-pulse bg-neutral" />}

      {slides.map((s, i) => {
        const isActive = i === idx;
        const animationClass =
          isActive && !prefersReducedMotion
            ? animationState === "in"
              ? "slide-in"
              : animationState === "out"
              ? "slide-out"
              : ""
            : isActive
            ? "opacity-100"
            : "opacity-0";

        if (!s.imageUrl || typeof s.imageUrl !== 'string') {
          return null;
        }

        return (
          <Image
            key={s._id}
            src={s.imageUrl}
            alt={s.alt || "Banner"}
            fill
            priority={i === 0}
            className={`object-cover absolute inset-0 transition-opacity duration-500 ${animationClass} ${s.href && isActive ? 'cursor-pointer' : ''} ${!isActive ? 'pointer-events-none' : ''}`}
            sizes="(min-width:1280px) 1000px, 100vw"
            unoptimized
            onClick={() => {
              if (isActive && s.href) {
                window.open(s.href, '_blank', 'noopener,noreferrer');
              }
            }}
          />
        );
      })}

      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s._id}
            onClick={() => {
              setAnimationState("out");
              setTimeout(() => {
                setIdx(i);
                setAnimationState("in");
              }, 500);
            }}
            aria-label={`slide ${i + 1}`}
            className={`h-2 w-2 rounded-full ${i === idx ? "bg-accent" : "bg-accent/60"}`}
          />
        ))}
      </div>
    </div>
  );
}