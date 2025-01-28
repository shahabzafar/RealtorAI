import React, { useState } from 'react';
import '../../styles/Realtor/Carousel.css';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample images or infographics for the carousel
  const images = [
    { src: 'infographic1.jpg', alt: 'Infographic 1' },
    { src: 'infographic2.jpg', alt: 'Infographic 2' },
    { src: 'infographic3.jpg', alt: 'Infographic 3' },
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="carousel">
      <button className="carousel-control prev" onClick={handlePrev}>
        ❮
      </button>
      <div className="carousel-slide">
        <img src={images[currentIndex].src} alt={images[currentIndex].alt} />
      </div>
      <button className="carousel-control next" onClick={handleNext}>
        ❯
      </button>
    </div>
  );
};

export default Carousel;
