import React, { useEffect, useMemo, useState } from 'react';
import './ImageCarousel.css';

const ImageCarousel = ({
  images = [],
  autoplay = false,
  intervalMs = 4000,
  showIndicators = true,
  height = 'default',
  ariaLabel = 'Image carousel'
}) => {
  const validImages = useMemo(() => images.filter((img) => img && img.src), [images]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoplay) return;
    if (validImages.length <= 1) return;

    const t = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % validImages.length);
    }, intervalMs);

    return () => window.clearInterval(t);
  }, [autoplay, intervalMs, validImages.length]);

  const prev = () => {
    if (validImages.length === 0) return;
    setIndex((i) => (i - 1 + validImages.length) % validImages.length);
  };

  const next = () => {
    if (validImages.length === 0) return;
    setIndex((i) => (i + 1) % validImages.length);
  };

  const safeIndex = validImages.length > 0 ? index % validImages.length : 0;
  const current = validImages[safeIndex];

  return (
    <section className={`image-carousel ${height === 'large' ? 'large' : ''}`} aria-label={ariaLabel}>
      <div className="carousel-stage">
        {current ? (
          <img key={current.src} className="carousel-img" src={current.src} alt={current.alt || 'Carousel slide'} />
        ) : (
          <div className="carousel-empty">No images available.</div>
        )}

        {validImages.length > 1 ? (
          <>
            <button type="button" className="carousel-control prev" onClick={prev} aria-label="Previous image">
              ‹
            </button>
            <button type="button" className="carousel-control next" onClick={next} aria-label="Next image">
              ›
            </button>
          </>
        ) : null}
      </div>

      {showIndicators && validImages.length > 1 ? (
        <div className="carousel-indicators" role="tablist" aria-label="Choose slide">
          {validImages.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className={`indicator ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === safeIndex}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default ImageCarousel;

