import { useState, useEffect } from 'react';

const IMAGES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop',
];

export const useSlider = (totalSlides = 3, intervalTime = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [totalSlides, intervalTime]);

  return { currentIndex, setCurrentIndex, currentImage: IMAGES[currentIndex] };
};